import { 	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			OnGatewayConnection,
			OnGatewayDisconnect
								} from "@nestjs/websockets";
import { stringify } from "querystring";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'

type GameDataType = {
	player1: {
		login?: string,
		y: number,
		score: number
	},
	player2: {
		login?: number
		y: number,
		score: number
	},
	ball: {
		x: number,
		y: number,
		r: number,
		speed: {
			x: number,
			y: number
		}
	}
}

type RoomInfo = {
	roomId: string
}

@WebSocketGateway({ namespace: 'gameTrans' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor (private readonly gameService: GameService) {}

	@WebSocketServer()
	server: Server

	@SubscribeMessage('createGame')
	async newGame(client: Socket) {
		const newGame = await this.gameService.registerNewGame('WAIT');
		if (newGame)
			client.join(newGame.game_id.toString());
		console.log("----------------------> " + client.id + " created a new game");
		return newGame;
	}

	@SubscribeMessage('joinGame')
	async joinGame(client: Socket, roomInfo: RoomInfo) {
		const roomId = roomInfo.roomId;
		if (!this.server.sockets.adapter.rooms.get(roomId)) {
		  // La salle n'existe pas
		  return { error: 'La salle n\'existe pas' };
		}
		// La salle existe, rejoindre la salle
		client.join(roomId);
		return { success: true };
	}
	


	@SubscribeMessage('move')
	onMove(client: Socket, gameData: GameDataType){
		//console.log("|\n|\n|\n|\n|\n|\n|\n|\n|\n-----------------------------------> " + gameData);
		this.server.emit('gameUpdate', gameData);
	}

	handleConnection(client: Socket, ...args: any[]) {
		console.log(`\n|\n|\n|\n|\n|\n|\n|Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}
}
