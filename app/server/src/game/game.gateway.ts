import { 	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			OnGatewayConnection,
			OnGatewayDisconnect
								} from "@nestjs/websockets";
import { stringify } from "querystring";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { GameDataType, RoomInfo, playerInfo, GamePatron, gamePatron } from './game.types'
import { GameAlgo } from "./game.algo";
import { Injectable } from "@nestjs/common";


@Injectable()
@WebSocketGateway({ namespace: 'gameTransaction' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor (
		private readonly gameService: GameService,
	) {}

	@WebSocketServer()
	server: Server

	// so i will be able to difference both player in the game
	players: playerInfo[] = [];
	gameMap = new Map<string, GameAlgo>();
	connectionCount = 0;

	@SubscribeMessage('createGame')
	async newGame(client: Socket) {
		const newGame = await this.gameService.registerNewGame('WAIT');
		if (newGame)
			client.join(newGame.game_id.toString());
		console.log("----------------------> " + client.id + " created a new game");
		this.server.emit('roomsUpdate');
		// keeping track of the room configuration

		this.players.push( { playerID: client.id, playerRole: "p1", roomID: newGame.game_id.toString(), playerSocket: client} );
		return newGame;
	}

	@SubscribeMessage('joinGame')
	joinGame(client: Socket, roomInfo: RoomInfo) {
		const roomId: string = roomInfo.roomId;
		/**
		 * here i still need to check if the room ID is in the players array
		 */
		// if roomID has been created before, you make the client join it
		client.join(roomId);

		// we add the player2 in the players array
		this.players.push( { playerID: client.id, playerRole: "p2", roomID: roomId, playerSocket: client} );

		// we update in the DB the status of the game
		this.gameService.updateGamestatus(parseInt(roomInfo.roomId), 'FULL');

		// we tell every socket that the game waiting list have change so they can refresh their list
		this.server.emit('roomsUpdate');

		// we tell the room (so both player 1 and 2) that everything is ready to start the game
		this.server.to(roomId).emit('lockAndLoaded');

		// we start the game in the server by calling the runGame function, we give player1 and player2 info
		const player1 = this.players.find(p => p.playerRole === 'p1' && p.roomID === roomId);
		const player2 = this.players.find(p => p.playerRole === 'p2' && p.roomID === roomId);

		if (player1?.roomID === player2?.roomID && player1 && player2){
			const newGame = new GameAlgo(player1, player2, this.server)
			this.gameMap.set(player1!.roomID, newGame);
			newGame.runGame();
		}

		console.log("room join attempt, roomID: " + roomId);

		return { success: true };
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.connectionCount++;
		console.log(`\n|\n|\n|\n|\n|\n|\n|Client connected: ${client.id}`);
		console.log('number of connected client ' + this.connectionCount);
	}

	handleDisconnect(client: Socket) {
		this.connectionCount--;
		console.log(`Client disconnected: ${client.id}`);
	}

}
