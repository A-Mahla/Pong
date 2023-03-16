import { 	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			OnGatewayConnection,
			OnGatewayDisconnect
								} from "@nestjs/websockets";
import { stringify } from "querystring";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { GameDataType, RoomInfo, playerInfo, GamePatron, gamePatron } from './game.types'
import { GameAlgo } from "./game.algo";

@WebSocketGateway({ namespace: 'gameTrans' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor (
		private readonly gameService: GameService,
		private readonly gameAlgo: GameAlgo
		) {}

	@WebSocketServer()
	server: Server

	// so i will be able to difference both player in the game
	players: playerInfo[] = [];
	connectionCount = 0;

	@SubscribeMessage('createGame')
	async newGame(client: Socket) {
		const newGame = await this.gameService.registerNewGame('WAIT');
		if (newGame)
			client.join(newGame.game_id.toString());
		console.log("----------------------> " + client.id + " created a new game");
		this.server.emit('roomsUpdate');
		// keeping track of the room configuration

		this.players.push( { playerID: client.id, playerRole: "p1", roomID: newGame.game_id.toString()} );
		return newGame;
	}

	@SubscribeMessage('joinGame')
	async joinGame(client: Socket, roomInfo: RoomInfo) {
		const roomId: string = roomInfo.roomId;
		/**
		 * here i still need to check if the room ID is in the players array
		 */
		// if roomID has been created before, you make the client join it
		client.join(roomId);

		// we add the player2 in the players array
		this.players.push( { playerID: client.id, playerRole: "p2", roomID: roomId} );

		// we update in the DB the status of the game
		this.gameService.updateGamestatus(parseInt(roomInfo.roomId), 'FULL');

		// we tell every socket that the game waiting list have change so they can refresh their list
		this.server.emit('roomsUpdate');

		// we tell the room (so both player 1 and 2) that everything is ready to start the game
		this.server.to(roomId).emit('lockAndLoaded');

		// we start the game in the server by calling the runGame function, we give player1 and player2 info
		const player1 = this.players.find(p => p.playerRole === 'p1' && p.roomID === roomId);
		const player2 = this.players.find(p => p.playerRole === 'p2' && p.roomID === roomId);

		this.runGame([player1, player2] , 2);
		console.log("room join attempt, roomID: " + roomId);

		return { success: true };
	}
/*
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
			if (gameData.ball.y > bornInf && gameData.ball.y < bornSup) {
				gameData.ball.speed.x *= -1,2;
			} else {
				// player1 loose, we reset the ball at the center of the field
				gameData.player2.score += 1;
				gameData.ball.x = gameData.roomInfo.canvasWidth / 2;
				gameData.ball.y = gameData.roomInfo.canvasHeight / 2;
				gameData.ball.speed.x = 0;
				gameData.ball.speed.y = 0;
				gameData.roomInfo.countDownRequired = true;
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
		// will have to change to emit in a specific room
		if (playerInfo?.roomID)
			return client.to(playerInfo.roomID).emit('gameUpdate', gameData);
		else
			return client.broadcast.emit('gameUpdate', gameData);
	}



	@SubscribeMessage('setupGame')
	onInit(client: Socket, gameData: GameDataType) {
		const playerInfo = this.players.find(p => p.playerID === client.id);

		gameData.roomInfo.countDownRequired = false;
		// setting the player paddle height 64 time smaller than the canvas height
		gameData.roomInfo.playerHeight = gameData.roomInfo.canvasHeight / 6.4;

		// setting players positions at (height / 2)
		gameData.player1.y = gameData.roomInfo.canvasHeight / 2 - gameData.roomInfo.playerHeight / 2;

		gameData.player2.y = gameData.roomInfo.canvasHeight / 2 - gameData.roomInfo.playerHeight / 2;

		// ball is set up in the middle of the canva, 64 times smaller than the height
		gameData.ball.x = gameData.roomInfo.canvasWidth / 2;
		gameData.ball.y = gameData.roomInfo.canvasHeight / 2;
		gameData.ball.r = gameData.roomInfo.canvasHeight / 128;
		// because it is set up, speed is 0 so it stay static
		gameData.ball.speed.x = 0;
		gameData.ball.speed.y = 0;

		// we emit the setup separatly so each user will be able to get the username of the other
		//client.broadcast.emit('gameIsSet', gameData);
		if (playerInfo?.roomID)
			client.to(playerInfo.roomID).emit('gameIsSet', gameData);
		else
			client.broadcast.emit('gameIsSet', gameData); //NORMALY THERE I EMIT AN ERROR !!
	}
*/
	handleConnection(client: Socket, ...args: any[]) {
		this.connectionCount++;
		console.log(`\n|\n|\n|\n|\n|\n|\n|Client connected: ${client.id}`);
		console.log('number of connected client ' + this.connectionCount);
	}

	handleDisconnect(client: Socket) {
		this.connectionCount--;
		console.log(`Client disconnected: ${client.id}`);
	}









	async	runGame(players: (playerInfo | undefined)[], nbPlayers: number) {
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

		this.server.on('login', (login: string, socket: Socket) => {
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

		this.server.on('paddlePos', (y: number, socket: Socket) => {
			if (players.find(p => p?.playerID === socket.id)?.playerRole === 'p1')
			gameData.player1.y = y;
			else if (players.find(p => p?.playerID === socket.id)?.playerRole === 'p2')
			gameData.player2.y = y;
		})

		const timer = setTimeout(() => {
			const nini = setInterval(() => {
				console.log("YOOOOOOOOOOOOOOOOOOOO");
				gameData.ball.y += gameData.ball.speed.y;
				gameData.ball.x += gameData.ball.speed.x;
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
						return ;
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
						return ;
					}
				}
				for (let i = 0; i < nbPlayers; i++){
					this.server.to(players[i]!.playerID).emit('updateClient', gameData);
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
