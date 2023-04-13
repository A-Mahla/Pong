import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { 	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect
						} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { GameDataType, Status, gamePatron, GamePatron, Player, GameParams } from './game.types'
import { interval } from 'rxjs';
import { resolve } from 'path';
import { rejects } from 'assert';
import { error } from 'console';
import { EventEmitter } from 'events';

/**
 * here we run all the game algorithm when a room is set up
 */



export class GameAlgo {

	private		status: Status
	private	gameModel = gamePatron;
	private player1: Player | undefined;
	private player2: Player | undefined;

	public gameConfig: GameParams;

	// private countDown: NodeJS.Timeout | undefined;
	private interval: NodeJS.Timeout | undefined;

	private gameData: GameDataType;

	public watchers: (Socket | null)[] = [];
	private readonly internalEvents: EventEmitter

	constructor (
		private readonly gameService: GameService,
				readonly server: Server,
				readonly roomID: string,
	) {
		this.gameData = this.initGameData(this.gameModel);
		this.status = Status.EMPTY;
		this.internalEvents = new EventEmitter()


	}

	public async launchGame() {
		return (
			new Promise<string>((resolve, rejects) => {
				this.internalEvents.once('stop', () => {

					this.status = Status.OVER;
					rejects('BLOCKED');
				});

				const checkPlayer = (count: number, timeout: NodeJS.Timeout) => {
					if (this.player1 && this.player2 && this.player2.id != this.player1.id)
					{
						clearTimeout(timeout);
						this.shutDownInternalEvents();
						console.log("ici le nouveau test  " + this.gameData.roomInfo.playerHeigth)
						this.server.to(this.player1.socketID).emit('initSetup', this.gameData);
						this.server.to(this.player2.socketID).emit('initSetup', this.rotateGameData(this.gameData));
						this.startGame().then(solved => {
								this.gameService.endGameDBwrites(this.roomID, this.player1!, this.player2!, this.gameData);
								this.status = Status.OVER;
								resolve(solved);
						})
						.catch(rejected => {
							this.status = Status.OVER;
							rejects(rejected);
						});
					}
					else if (count > 600)
					{
						clearTimeout(timeout);
						this.status = Status.OVER;
						return rejects('TIME');
					}
					else
					{
						clearTimeout(timeout);
						timeout = setTimeout(() => {
							checkPlayer(++count, timeout)
						}, 100)
					}
				}
				let count = 0;
				let timeout: any = 0 ;
				checkPlayer(count, timeout);
			})
		)
	}

	private async	startGame() {
			return new Promise<string>((resolve, rejects) => {
				this.status = Status.RUNNING;

				this.internalEvents.on('start', () => {
					clearInterval(this.interval);
					this.interval = setInterval(this.computeGame.bind(this), 16)
				});

				this.internalEvents.on('pause', (countDown: number) => {
					clearInterval(this.interval);
					let milisecond = 0;
					this.interval = setInterval(() => {
						this.countDown(countDown, milisecond++);
					}, 20)
				});

				this.internalEvents.on('stop', (endofgame) => {
					clearInterval(this.interval);
					if (endofgame === '0')
						resolve(endofgame);
					else
						rejects(endofgame);
				});

				this.internalEvents.emit('pause', (10));
			})
	}

	private computeGame() {
		this.gameData.ball.x += this.gameData.ball.speed.x;
		this.gameData.ball.y += this.gameData.ball.speed.y;

		if (this.gameData.ball.y > this.gameModel.canvasHeight || this.gameData.ball.y < 0) {
			this.gameData.ball.speed.y *= -1;
		}
		// player 1 kill zone
		if (this.gameData.ball.x < 15) {
			let bornInfP1 = (this.gameData.player1.y - this.gameModel.playerHeight / 2)
			let bornSupP1 = (this.gameData.player1.y + this.gameModel.playerHeight / 2)

			if (this.gameData.ball.y > bornInfP1 && this.gameData.ball.y < bornSupP1) {
				this.gameData.ball.speed.x *= -1,2;
			} else {
				this.gameData.player2.score += 1;
				this.gameData.ball.x = this.gameModel.canvasWidth / 2;
				this.gameData.ball.y = this.gameModel.canvasHeight / 2;
				this.internalEvents.emit('pause', 3)
			}

		}
		// player 2 kill zone
		if (this.gameData.ball.x > (this.gameModel.canvasWidth - 15)) {
			let bornInfP2 = (this.gameData.player2.y - (Math.floor(this.gameModel.playerHeight / 2)))
			let bornSupP2 = (this.gameData.player2.y + (Math.floor(this.gameModel.playerHeight / 2)))

			if (this.gameData.ball.y > bornInfP2 && this.gameData.ball.y < bornSupP2) {
				this.gameData.ball.speed.x *= -1,2;
			} else {
				this.gameData.player1.score += 1;
				this.gameData.ball.x = this.gameModel.canvasWidth / 2;
				this.gameData.ball.y = this.gameModel.canvasHeight / 2;
				this.internalEvents.emit('pause', 3);
			}
		}
		// game is finish (3750ms == 1min)
		if ( ++this.gameData.roomInfo.timer == this.gameData.roomInfo.duration /*|| this.playersTimeout()*/ ) {
			this.server.to(this.player1!.socketID).volatile.emit('gameOver', this.gameData);
			this.server.to(this.player2!.socketID).volatile.emit('gameOver', this.rotateGameData(this.gameData));
			this.status = Status.OVER;
			this.internalEvents.emit('stop', '0');
			return ;
		}
		this.server.to(this.player1!.socketID).volatile.emit('updateClient', this.gameData);
		this.server.to(this.player2!.socketID).volatile.emit('updateClient', this.rotateGameData(this.gameData));
		this.watchers.forEach((socket: Socket) => {
			if (socket)
				this.server.to(socket.id).volatile.emit('updateClient', this.gameData);
		})
	}

	private countDown(countDown: number, miliseconds: number) {
		this.gameData.roomInfo.countDown = countDown;
		this.server.to(this.player1!.socketID).volatile.emit('updateClient', this.gameData);
		this.server.to(this.player2!.socketID).volatile.emit('updateClient', this.rotateGameData(this.gameData));

		this.watchers.forEach((socket: Socket) => {
			if (socket)
				this.server.to(socket.id).volatile.emit('updateClient', this.gameData);
		})

		if (!countDown) {
			this.gameData.roomInfo.countDown = -1;
			this.internalEvents.emit('start')
		}
		else if ((miliseconds === 50)) // 50 == 1sec
			this.internalEvents.emit('pause', (--countDown));
	}

	public initPlayer1(player: Player, gameConfig: GameParams | undefined) {
		this.player1 = player;
		this.gameData.player1.login = this.player1.login;
		this.status = Status.ONE_PLAYER;

		// registering player1 y listeners
		this.player1.playerSocket.once('quitGame', (socket: Socket) => {
			this.internalEvents.emit('stop', '1');
		})

		this.player1.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
			this.gameData.player1.y = y;
			this.gameData.player1.timeout = Date.now();
		})
		if (gameConfig)
			this.gameConfig = gameConfig;
		else
			this.gameConfig = { ballSpeed: '7', paddleSize: '100', duration: '3750' }


		this.gameData.ball.speed.x = this.gameData.ball.speed.y = parseInt(this.gameConfig.ballSpeed);
		this.gameModel.playerHeight = this.gameData.roomInfo.playerHeigth = parseInt(this.gameConfig.paddleSize);

		this.gameData.roomInfo.duration = parseInt(this.gameConfig.duration);
		console.log('ici le test ---> ' + this.gameModel.playerHeight + " " + this.gameData.roomInfo.playerHeigth);
		this.server.to(this.player1.socketID).emit('lockAndLoaded');
	}

	public initPlayer2(player: Player) {
		this.player2 = player;
		this.gameData.player2.login = this.player2.login;
		this.status = Status.TWO_PLAYER;

		// registering player2 y listeners

		this.player2.playerSocket.once('quitGame', (socket: Socket) => {
			this.internalEvents.emit('stop', '2');
		})

		this.player2.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
			this.gameData.player2.y = y;
			this.gameData.player2.timeout = Date.now();
		})

		this.server.to(this.player2.socketID).emit('lockAndLoaded');
	}


	public getStatus() : Status {
		return (this.status);
	}

	public getPlayerID(player1ou2: number) : string {

		if (player1ou2 === 1)
			return this.player1!.id.toString()
		else if (player1ou2 === 2)
			return this.player2!.id.toString()
		else
			return "error"
	}

	public getPlayerSocketID(player1ou2: number) : string {

		if (player1ou2 === 1 && this.player1)
			return this.player1.socketID
		else if (player1ou2 === 2 && this.player2)
			return this.player2.socketID
		else
			return "error"
	}

	public getPlayerLogin(player1ou2: number) : string {

		if (player1ou2 === 1 && this.player1)
			return this.player1.login
		else if (player1ou2 === 2 && this.player2)
			return this.player2.login
		else
			return "error"
	}


	public playerChangeSocket(playerSocket: Socket, socketID: string, player1ou2: number) {
		if (player1ou2 === 1) {
			this.player1!.playerSocket = playerSocket
			this.player1!.socketID = socketID;
			this.player1!.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
				this.gameData.player1.y = y;
				this.gameData.player1.timeout = Date.now();
			})


		}
		else if (player1ou2 === 2){
			this.player2!.playerSocket = playerSocket
			this.player2!.socketID = socketID;
			this.player2!.playerSocket.on('paddlePos', (y: number, socket: Socket) => {
				this.gameData.player2.y = y;
				this.gameData.player2.timeout = Date.now();
			})
		}
	}

	public addWatcherSocketID(newWatcherSocket: Socket) {
		this.watchers.push(newWatcherSocket);
		this.server.to(newWatcherSocket.id).emit('initSetup', this.gameData);
		newWatcherSocket.on('quitGame', () => {
			this.watchers.forEach((value, index) => {
				if (value === newWatcherSocket) {
					this.watchers[index] = null;
				}
			})
		})
	}

	public shutDownInternalEvents() {
		this.internalEvents.removeAllListeners();
	}

	// initialising the players and ball positions
	private initGameData(gamePatron: GamePatron): GameDataType {
		return ({
			roomInfo: {
				playerHeigth: 100,
				duration: 3750,
				countDown: 0,
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
					x: 7,
					y: 7
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
		if ((Date.now() - this.gameData.player1.timeout) > 10000)
		{
			this.gameData.player1.score = 0;
			this.gameData.player2.score += 1;
			return (true);
		}
		else if (((Date.now() - this.gameData.player2.timeout) > 10000 )) {
			this.gameData.player1.score += 1;
			this.gameData.player2.score = 0;
			return (true);
		}
		else
			return (false)
	}
}
