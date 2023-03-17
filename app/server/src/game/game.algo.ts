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

	constructor (
		readonly player1: playerInfo,
		readonly player2: playerInfo,
		readonly server: Server
	) {
		if (player1 && player1.roomID === player2.roomID)
			this.roomID = player1.roomID;
			this.gameData = this.initGameData(this.gameModel)
	}


	async	runGame() {

		this.gameData = this.initGameData(this.gameModel);

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

		const timer = setTimeout(() => {
			setInterval(() => {
				// if we hit height border, we bounce by reversing ball y velocity
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
						this.gameData.ball.speed.x = 0;
						this.gameData.ball.speed.y = 0;
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
						this.gameData.ball.speed.x = 0;
						this.gameData.ball.speed.y = 0;
					}
				}
				this.server.to(this.player1!.playerID).emit('updateClient', this.gameData);
				this.server.to(this.player2!.playerID).emit('updateClient', this.rotateGameData(this.gameData));
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
		let temp = {...gameData,
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
