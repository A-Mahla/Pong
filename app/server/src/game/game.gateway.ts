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

@WebSocketGateway({ namespace: 'gameTrans' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor (private readonly gameService: GameService) {}

	@WebSocketServer()
	server: Server

	@SubscribeMessage('createGame')
	async newGame(client: Socket) {
		const newGame = await this.gameService.registerNewGame();
		if (newGame)
			client.join(newGame.game_id.toString());
		return newGame;

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
