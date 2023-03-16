import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { 	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
						} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { GameDataType, RoomInfo, playerInfo, gamePatron, GamePatron } from './game.types'

/**
 * here we run all the game algorithm when a room is set up
 */

@Injectable()
export class GameAlgo {


	async	runGame(server: Server, players: (playerInfo | undefined)[], nbPlayers: number) {
		const	gameModel = gamePatron;
		let		gameData: GameDataType;
		let		client1IsInit: boolean = false;
		let		client2IsInit: boolean = false;

		for (let i = 0; i < nbPlayers; i++){
			if (players[i] === undefined ) {
				// throw something because it is very not normal
			}
		}

		gameData = this.initGameData(gameModel);

		server.on('login', (login: string, socket: Socket) => {
			console.log("LAAAAAAAAAAAAAAAAAAAAAAAAAAAAA !");
			socket.to(players[0]!.roomID).emit('initSetup', {...gameData,
				player2: {
					...gameData.player2,
					login: login
				}
			})
			if (!client1IsInit || !client2IsInit)
			{

				//const player1 = this.players.find(p => p.playerRole === 'p1' && p.roomID === roomId);
				if (players.find(p => p?.playerID === socket.id)?.playerRole === 'p1'){
					gameData.player1.login = login;
					client1IsInit = true;
				}
				else if (players.find(p => p?.playerID === socket.id)?.playerRole === 'p2') {
					gameData.player2.login = login;
					client2IsInit = true;
				}
			}
		})

		server.on('paddlePos', (y: number, socket: Socket) => {
			if (players.find(p => p?.playerID === socket.id)?.playerRole === 'p1')
			gameData.player1.y = y;
			else if (players.find(p => p?.playerID === socket.id)?.playerRole === 'p2')
			gameData.player2.y = y;
		})

		const timer = setTimeout(() => {
			setInterval(() => {
				// if we hit height border, we bounce by reversing ball y velocity
				if (gameData.ball.y > gameModel.canvasHeight || gameData.ball.y < 0) {
					gameData.ball.speed.y *= -1;
				}
				// player 1 kill zone
				if (gameData.ball.x < 15) {
					let bornInfP1 = (gameData.player1.y - gameModel.playerHeight)
					let bornSupP1 = (gameData.player1.y + gameModel.playerHeight)

					if (gameData.ball.y > bornInfP1 && gameData.ball.y < bornSupP1) {
						gameData.ball.speed.x *= -1,2;
					} else {
						// player1 loose, we reset the ball at the center of the field
						gameData.player2.score += 1;
						gameData.ball.x = gameModel.canvasWidth / 2;
						gameData.ball.y = gameModel.canvasHeight / 2;
						gameData.ball.speed.x = 0;
						gameData.ball.speed.y = 0;
					}

				}
				// player 2 kill zone
				if (gameData.ball.x > (gameModel.canvasWidth - 15)) {
					let bornInfP2 = (gameData.player2.y - gameModel.playerHeight)
					let bornSupP2 = (gameData.player2.y + gameModel.playerHeight)

					if (gameData.ball.y > bornInfP2 && gameData.ball.y < bornSupP2) {
						gameData.ball.speed.x *= -1,2;
					} else {
						// player2 loose, we reset the ball at the center of the field
						gameData.player1.score += 1;
						gameData.ball.x = gameModel.canvasWidth / 2;
						gameData.ball.y = gameModel.canvasHeight / 2;
						gameData.ball.speed.x = 0;
						gameData.ball.speed.y = 0;
					}
				}
				for (let i = 0; i < nbPlayers; i++){
					server.to(players[i]!.playerID).emit('updateClient', gameData);
					gameData = this.rotateGameData(gameData);
				}
				gameData = this.rotateGameData(gameData)
			}, 16);
		}, 5000);
	}


	// initialising the players and ball positions
	initGameData(gamePatron: GamePatron): GameDataType {
		return ({
			player1: {
				login: 'p1',
				y: gamePatron.canvasHeight / 2,
				score: 0
			},
			player2: {
				login: 'p2',
				y: gamePatron.canvasHeight / 2,
				score: 0
			},
			ball: {
				x: gamePatron.canvasWidth / 2,
				y: gamePatron.canvasHeight / 2,
				r: 5,
				speed: {
					x: 2,
					y: 2
				}
			}
		})
	}

	rotateGameData(gameData: GameDataType): GameDataType {
		let temp: GameDataType = {...gameData,
		player1: {
			...gameData.player2
		},
		player2: {
			...gameData.player1
		},
		ball: {
			...gameData.ball,
			x: (gameData.ball.x * -1)
		}
	};
		return temp;
	}

}
