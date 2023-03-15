import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { 	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
						} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { GameDataType, RoomInfo, playerInfo, gamePatron } from './game.types'

/**
 * here we run all the game algorithm when a room is set up
 */

@Injectable()
export class GameAlgo {


	async	runGame(server: Server, players: (playerInfo | undefined)[], nbPlayers: number) {
		const	gameModel = gamePatron;
		let		gameDataP1: GameDataType;

		for (let i = 0; i < nbPlayers; i++){
			if (players[i] === undefined ) {
			// throw something because it is very not normal
			}
		}

		server.once('gameInit', (login: string, socket: Socket) => {
			gameDataP1.ball.r = 5;
			gameDataP1.ball.x = gameModel.canvasWidth / 2;
			gameDataP1.ball.y = gameModel.canvasHeight / 2;
			gameDataP1.player1.score = 0;
			gameDataP1.player1.y = gameModel.canvasHeight / 2;
			gameDataP1.player2.score = 0;
			gameDataP1.player2.y = gameModel.canvasHeight / 2;
			gameDataP1.player2.login = login;
			socket.to(players[0]!.roomID).emit('setupGame', gameDataP1);
		})

		const timer = setTimeout(() => {
			setInterval(() => {
				if (gameDataP1.ball.speed.x === 0 && gameDataP1.ball.speed.y === 0)
					gameDataP1.ball.speed.x = gameDataP1.ball.speed.y = 2;
				if (gameDataP1.ball.y > gameDataP1.roomInfo.canvasHeight || gameDataP1.ball.y < 0)
					gameDataP1.ball.speed.y *= -1;
					if (gameDataP1.ball.x < 15) {
						let bornInf = (gameDataP1.player1.y - gameDataP1.roomInfo.playerHeight)
						let bornSup = (gameDataP1.player1.y + gameDataP1.roomInfo.playerHeight)
						if (gameDataP1.ball.y > bornInf && gameDataP1.ball.y < bornSup) {
							gameDataP1.ball.speed.x *= -1,2;
						} else {
							// player1 loose, we reset the ball at the center of the field
							gameDataP1.player2.score += 1;
							gameDataP1.ball.x = gameDataP1.roomInfo.canvasWidth / 2;
							gameDataP1.ball.y = gameDataP1.roomInfo.canvasHeight / 2;
							gameDataP1.ball.speed.x = 0;
							gameDataP1.ball.speed.y = 0;
							gameDataP1.roomInfo.countDownRequired = true;
						}
					}

			}, 16);
		}, 10000);

	}
}
