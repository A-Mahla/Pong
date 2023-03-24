import { 	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			OnGatewayConnection,
			OnGatewayDisconnect
								} from "@nestjs/websockets";
import { stringify } from "querystring";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { ClientPayload, RoomInfo, GamePatron, gamePatron, Status, Player } from './game.types'
import { GameAlgo } from "./game.algo";
import { Injectable, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { jwtConstants } from "src/auth/constants";
import  jwt  from 'jsonwebtoken';

@Injectable()
@UseGuards(JwtAuthGuard)
@WebSocketGateway({ namespace: 'gameTransaction' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor (
		private readonly gameService: GameService,
	) {}

	@WebSocketServer()
	server: Server

	gameMap = new Map<string, GameAlgo>();

	@SubscribeMessage('automatikMatchMaking')
	async matchMaker(client: Socket, clientPayload: ClientPayload) {
		console.log("ici je passe !!")
		let gameToJoin: GameAlgo | undefined;

		this.gameMap.forEach((game) => {
			if (game.getStatus() === Status.ONE_PLAYER) {
				gameToJoin = game;
				return;
			}
		});

		if (gameToJoin) {
			// La première partie avec un statut 'ONE_PLAYER' a été trouvée et peut être utilisée ici
			client.join(gameToJoin.roomID);
			gameToJoin.initPlayer2({
				id: parseInt( clientPayload.id ),
				login: clientPayload.login,
				socketID: client.id,
				playerRole: "p2",
				playerSocket: client
			});
			this.server.to(client.id).emit('lockAndLoaded')
		} else {
		  // no waiting games with one player so we create one
		  	const newGameDB = await this.gameService.registerNewGame('WAIT');
			if (newGameDB) {
				client.join(newGameDB.game_id.toString());
				const newGameAlgo: GameAlgo = new GameAlgo(this.gameService, this.server, newGameDB.game_id.toString());
				this.gameMap.set( newGameDB.game_id.toString(), newGameAlgo);
				newGameAlgo.initPlayer1({
					id: parseInt( clientPayload.id ),
					login: clientPayload.login,
					socketID: client.id,
					playerRole: "p1",
					playerSocket: client
				});
				this.server.to(client.id).emit('lockAndLoaded')
			}
		}
		if (gameToJoin && gameToJoin.getStatus() === Status.TWO_PLAYER)
		{
			gameToJoin.startGame()
		}
	}

	handleConnection(client: Socket, ...args: any[]) {
		// if (client.handshake.headers.cookie && jwtConstants.jwt_secret) {
			// const token = client.handshake.headers.cookie.toString();
			// const decoded = jwt.verify(token, jwtConstants.jwt_secret);
		// }
			console.log(`Client connected: ${client.handshake.headers.cookie}\n-->${jwtConstants.jwt_secret}`);
	}



	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}
}
