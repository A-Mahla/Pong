import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { 	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
						} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { GameDataType, Status, gamePatron, GamePatron, Player } from './game.types'

/**
 * here we run all the game algorithm when a room is set up
 */



export class GameAlgo {

	private		status: Status
	readonly	gameModel = gamePatron;

	private countDown: NodeJS.Timeout | undefined;

	private player1: Player;
	private player2: Player;
	private gameData: GameDataType;

	constructor (
		private readonly gameService: GameService,
				readonly server: Server,
		readonly roomID: string
	) {
		this.gameData = this.initGameData(this.gameModel);
		this.status = Status.EMPTY;
	}

	async	startGame() {
		if (this.player1 && this.player2)
		{
			this.status = Status.RUNNING;
			this.server.to(this.player1!.socketID).emit('initSetup', this.gameData);
			this.server.to(this.player2!.socketID).emit('initSetup', this.rotateGameData(this.gameData));

			this.player1.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
				this.gameData.player1.y = y;
				this.gameData.player1.timeout = Date.now();
			})

			this.player2.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
				this.gameData.player2.y = y;
				this.gameData.player2.timeout = Date.now();
			})
			this.computeGame();
		}
	}

	private computeGame() {
		this.countDown = setTimeout(()=> {
			const interval = setInterval(() => {

				this.gameData.ball.x += this.gameData.ball.speed.x;
				this.gameData.ball.y += this.gameData.ball.speed.y;

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
				// game is finish (3750ms == 1min)
				if ( ++this.gameData.roomInfo.timer == 3750 || this.playersTimeout() ) {
					clearTimeout(this.countDown);
					clearInterval(interval);
					this.server.to(this.player1!.socketID).emit('gameOver', this.gameData);
					this.server.to(this.player2!.socketID).emit('gameOver', this.rotateGameData(this.gameData));
					this.status = Status.OVER;
					this.gameService.endGameDBwrites(this.roomID, this.player1, this.player2, this.gameData);
					return ;
				}
				this.server.to(this.player1!.socketID).emit('updateClient', this.gameData);
				this.server.to(this.player2!.socketID).emit('updateClient', this.rotateGameData(this.gameData));

			}, 16);
		}, 5000)
	}

	public initPlayer1(player: Player) {
		this.player1 = player;
		this.gameData.player1.login = this.player1.login;
		this.status = Status.ONE_PLAYER;
	}

	public initPlayer2(player: Player) {
		this.player2 = player;
		this.gameData.player2.login = this.player2.login;
		this.status = Status.TWO_PLAYER;
	}


	public getStatus() : Status {
		return (this.status);
	}

	public getPlayerID(player1ou2: number) : string {

		if (player1ou2 === 1)
		return this.player1.id.toString()
		else if (player1ou2 === 2)
		return this.player2.id.toString()
		else
		return "error"
	}

	public playerChangeSocket(playerSocket: Socket, socketID: string, player1ou2: number) {
		if (player1ou2 === 1) {
			this.player1.playerSocket = playerSocket
			this.player1.socketID = socketID;
			this.player1.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
				this.gameData.player1.y = y;
				this.gameData.player1.timeout = Date.now();
			})


		}
		else if (player1ou2 === 2){
			this.player2.playerSocket = playerSocket
			this.player2.socketID = socketID;
			this.player2.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
				this.gameData.player2.y = y;
				this.gameData.player2.timeout = Date.now();
			})
		}
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
				score: 0,
				timeout: 0
			},
			player2: {
				login: 'p2',
				y: gamePatron.canvasHeight / 2,
				score: 0,
				timeout: 0
			},
			ball: {
				x: gamePatron.canvasWidth / 2,
				y: gamePatron.canvasHeight / 2,
				r: 5,
				speed: {
					x: 5,
					y: 5
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

	private playersTimeout(): boolean {
		if ((Date.now() - this.gameData.player1.timeout) > 6500 || ((Date.now() - this.gameData.player1.timeout) > 6500 ))
		{
			this.gameData.player1.score = 0;
			this.gameData.player2.score = 1;
			return (true);
		}
		else if (((Date.now() - this.gameData.player1.timeout) > 6500 )) {
			this.gameData.player1.score = 1;
			this.gameData.player2.score = 0;
			return (true);
		}
		else
			return (false)
	}
}
