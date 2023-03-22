import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { 	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
						} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameGateway } from './game.gateway';
import { GameDataType, RoomInfo, playerInfo, gamePatron, GamePatron } from './game.types'

/**
 * here we run all the game algorithm when a room is set up
 */

export class GameAlgo {

	readonly roomID: string;
	readonly gameModel = gamePatron;
	readonly nbPlayers = 2;

	private gameData: GameDataType;
	private countDown: NodeJS.Timeout | undefined;

	constructor (
		readonly player1: playerInfo,
		readonly player2: playerInfo,
		readonly server: Server
	) {
		if (player1 && player1.roomID === player2.roomID) {
			this.roomID = player1.roomID;
			this.gameData = this.initGameData(this.gameModel)
		}
	}

	async	runGame() {
		let nbInitClient = 0;
		this.player1.playerSocket.on('login', (login: string, socket: Socket) => {
			this.gameData.player1.login = login;
			this.server.to(this.player1.playerID).emit('initSetup', this.gameData)
		})
		this.player2.playerSocket.on('login', (login: string, socket: Socket) =>{
			this.gameData.player2.login = login;
			this.server.to(this.player2.playerID).emit('initSetup', this.rotateGameData(this.gameData))
		})

		this.player1.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
			this.gameData.player1.y = y;
		})

		this.player2.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
			this.gameData.player2.y = y;
		})
		this.player1.playerSocket.on('isInit', (isInit) => {nbInitClient++})
		this.player2.playerSocket.on('isInit', (isInit) => {nbInitClient++})

		if (nbInitClient === this.nbPlayers)
			this.computeGame();
	}

	private computeGame() {
		this.countDown = setTimeout(()=> {
			const interval = setInterval(() => {
				if (this.gameData.ball.y > this.gameModel.canvasHeight || this.gameData.ball.y < 0) {
					this.gameData.ball.speed.y *= -1;
				}
				// player 1 kill zone
				if (this.gameData.ball.x < 15) {
					let bornInfP1 = (this.gameData.player1.y - this.gameModel.playerHeight)
					let bornSupP1 = (this.gameData.player1.y + this.gameModel.playerHeight)

					if (this.gameData.ball.y > bornInfP1 && this.gameData.ball.y < bornSupP1) {
						this.gameData.ball.speed.x *= -1,2;
					} else {
						// player1 loose, we reset the ball at the center of the field
						this.gameData.player2.score += 1;
						this.gameData.ball.x = this.gameModel.canvasWidth / 2;
						this.gameData.ball.y = this.gameModel.canvasHeight / 2;
						clearInterval(interval);
						clearTimeout(this.countDown);
						this.computeGame()
					}

				}
				// player 2 kill zone
				if (this.gameData.ball.x > (this.gameModel.canvasWidth - 15)) {
					let bornInfP2 = (this.gameData.player2.y - this.gameModel.playerHeight)
					let bornSupP2 = (this.gameData.player2.y + this.gameModel.playerHeight)

					if (this.gameData.ball.y > bornInfP2 && this.gameData.ball.y < bornSupP2) {
						this.gameData.ball.speed.x *= -1,2;
					} else {
						// player2 loose, we reset the ball at the center of the field
						this.gameData.player1.score += 1;
						this.gameData.ball.x = this.gameModel.canvasWidth / 2;
						this.gameData.ball.y = this.gameModel.canvasHeight / 2;
						clearInterval(interval);
						clearTimeout(this.countDown);
						this.computeGame()

					}
				}
				this.gameData.ball.x += this.gameData.ball.speed.x;
				this.gameData.ball.y += this.gameData.ball.speed.y;

				if (++this.gameData.roomInfo.timer == 3750) {
					clearTimeout(this.countDown);
					clearInterval(interval);
					this.server.to(this.player1!.playerID).emit('gameOver', this.gameData);
					this.server.to(this.player2!.playerID).emit('gameOver', this.rotateGameData(this.gameData));
					return ;
				}
				this.server.to(this.player1!.playerID).emit('updateClient', this.gameData);
				this.server.to(this.player2!.playerID).emit('updateClient', this.rotateGameData(this.gameData));

			}, 16);
		}, 5000)
	}

	// initialising the players and ball positions
	private initGameData(gamePatron: GamePatron): GameDataType {
		return ({
			roomInfo: {
				timer: 0
			},
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
					x: 3,
					y: 3
				}
			}
		})
	}

	private rotateGameData(gameData: GameDataType): GameDataType {
		let temp = {...gameData,
			player1: {
				...gameData.player2
			},
			player2: {
				...gameData.player1
			},
			ball: {
				...gameData.ball,
				x: (this.gameModel.canvasWidth / 2) - (gameData.ball.x - (this.gameModel.canvasWidth / 2))
			}
		};
		return temp;
	}

}
