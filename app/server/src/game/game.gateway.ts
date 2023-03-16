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
	roomInfo: {
		//roomId: string,
		countDownRequired: boolean,
		canvasHeight: number,
		canvasWidth: number,
		playerHeight: number
		playerWidth: number
	}
	player1: {
		login?: string,
		y: number,
		score: number
	},
	player2: {
		login?: string,
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

interface RoomInfo {
	roomId: string
}

interface playerInfo {
	roomID: string,
	playerID: string,
	playerRole: "p1" | "p2"
}

@WebSocketGateway({ namespace: 'gameTrans' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor (private readonly gameService: GameService) {}



	@WebSocketServer()
	server: Server

	// so i will be able to difference both player in the game
	players: playerInfo[] = [];
	connectionCount = 0;

	@SubscribeMessage('createGame')
	async newGame(client: Socket) {
		const newGame = await this.gameService.registerNewGame('WAIT');
		//if (newGame)
		//	client.join(newGame.game_id.toString());
		console.log("----------------------> " + client.id + " created a new game");
		this.server.emit('roomsUpdate');
		// keeping track of the room configuration
		this.players.push( { playerID: client.id, playerRole: "p1", roomID: newGame.game_id.toString()} );
		return newGame;
	}

	@SubscribeMessage('joinGame')
	async joinGame(client: Socket, roomInfo: RoomInfo) {
		const roomId: string = roomInfo.roomId;
		// if (!this.server.sockets.adapter.rooms.get(roomId)) {
		//   La salle n'existe pas
		//   console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeere")
		//   return { error: 'La salle n\'existe pas' };
		// }
		// La salle existe, rejoindre la salle
		client.join(roomId);
		this.players.push( { playerID: client.id, playerRole: "p2", roomID: roomId} );
		this.gameService.updateGamestatus(parseInt(roomInfo.roomId), 'FULL');
		this.server.emit('roomsUpdate');
		this.server.to(roomId).emit('lockAndLoaded');
		console.log("room join attempt, roomID: " + roomId);
		return { success: true };
	}

	@SubscribeMessage('move')
	onMove(client: Socket, gameData: GameDataType){
		const playerInfo = this.players.find(p => p.playerID === client.id);
		// if game is paused, we make it move
		if (gameData.ball.speed.x === 0 && gameData.ball.speed.y  === 0)
			gameData.ball.speed.x = gameData.ball.speed.y = 2;
		// make the ball bounce on the height limits, should be common to both players
		if (gameData.ball.y > gameData.roomInfo.canvasHeight || gameData.ball.y < 0) {
			gameData.ball.speed.y *= -1;
		}
		if (gameData.ball.x < 15) {
			let bornInf = (gameData.player1.y - gameData.roomInfo.playerHeight)
			let bornSup = (gameData.player1.y + gameData.roomInfo.playerHeight)
			console.log("gameData.roomInfo.playerHeight: " + gameData.roomInfo.playerHeight + " | bornSup " + bornSup);
			if (gameData.ball.y > bornInf && gameData.ball.y < bornSup) {
				gameData.ball.speed.x *= -1,2;
			} else {
				// player1 loose, we reset the ball at the center of the field
				gameData.player2.score = 1;
				gameData.ball.x = gameData.roomInfo.canvasWidth / 2;
				gameData.ball.y = gameData.roomInfo.canvasHeight / 2;
				gameData.ball.speed.x = 0;
				gameData.ball.speed.y = 0;
			}
		}

		if ( playerInfo?.playerRole === "p1" )
		{
			gameData.ball.x = (gameData.roomInfo.canvasWidth / 2) + ((gameData.ball.x - gameData.roomInfo.canvasWidth / 2) * -1)
			gameData.ball.speed.x *= -1;
		} else if ( playerInfo?.playerRole === "p2" ) {
			gameData.ball.x = (gameData.roomInfo.canvasWidth / 2) + ((gameData.ball.x - gameData.roomInfo.canvasWidth / 2) * -1)
			gameData.ball.speed.x *= -1;
		}
		client.broadcast.emit('gameUpdate', gameData);
	}



	@SubscribeMessage('setupGame')
	onInit(client: Socket, gameData: GameDataType) {
		// setting the player paddle height 64 time smaller than the canvas height
		gameData.roomInfo.playerHeight = gameData.roomInfo.canvasHeight / 6.4;

		// setting players positions at (height / 2)
		gameData.player1.y = gameData.roomInfo.canvasHeight / 2 - gameData.roomInfo.playerHeight / 2;
		gameData.player1.score = 0;

		gameData.player2.y = gameData.roomInfo.canvasHeight / 2 - gameData.roomInfo.playerHeight / 2;
		gameData.player2.score = 0;

		// ball is set up in the middle of the canva, 64 times smaller than the height
		gameData.ball.x = gameData.roomInfo.canvasWidth / 2;
		gameData.ball.y = gameData.roomInfo.canvasHeight / 2;
		gameData.ball.r = gameData.roomInfo.canvasHeight / 128;
		// because it is set up, speed is 0 so it stay static
		gameData.ball.speed.x = 0;
		gameData.ball.speed.y = 0;

		console.log("login p1" + gameData.player1.login)
		console.log("login p2" + gameData.player2.login)
		// we emit the setup separatly so each user will be able to get the username of the other
		client.broadcast.emit('gameIsSet', gameData);
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
