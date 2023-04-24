import { 	SubscribeMessage,
			WebSocketGateway,
			WebSocketServer,
			OnGatewayConnection,
			OnGatewayDisconnect
								} from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service'
import { ClientPayload, GamePatron, gamePatron, Status, Player } from './game.types'
import { GameAlgo } from "./game.algo";
import { Injectable, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { jwtConstants } from "src/auth/constants";
import * as jwt from 'jsonwebtoken';
import { resolve } from "path";
import { rejects } from "assert";

@Injectable()
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
		console.log(clientPayload)
		let gameToJoin: GameAlgo | undefined;
		let notPlayingWithYourself = true

		this.gameMap.forEach((game) => {
			if (game.getStatus() === Status.ONE_PLAYER) {
				if (game.getPlayerID(1) === clientPayload.id)
					notPlayingWithYourself = false;
				else if (this.gameService.configMatch(clientPayload.config!, game.gameConfig))
					gameToJoin = game;
			}
		});

		if (gameToJoin) {
			// La première partie avec un statut 'ONE_PLAYER' a été trouvée et peut être utilisée ici
			client.join(gameToJoin.roomID);
			gameToJoin.initPlayer2({
				id: parseInt( clientPayload.id ),
				login: clientPayload.login,
				avatar: (await this.gameService.getAvatarPath(parseInt( clientPayload.id ))).avatar,
				socketID: client.id,
				playerRole: "p2",
				playerSocket: client,
				isReady: false
			});
		} else if (notPlayingWithYourself) {
			// no waiting games with one player so we create one
				const newGameDB = await this.gameService.registerNewGame('WAIT');
				if (newGameDB) {
						var newGameAlgo = new GameAlgo(this.gameService, this.server, newGameDB.game_id.toString(), Status.EMPTY);
						this.gameMap.set( newGameDB.game_id.toString(), newGameAlgo);
						newGameAlgo.initPlayer1({
							id: parseInt( clientPayload.id ),
							login: clientPayload.login,
							avatar: (await this.gameService.getAvatarPath(parseInt( clientPayload.id ))).avatar,
							socketID: client.id,
							playerRole: "p1",
							playerSocket: client,
							isReady: false
						}, clientPayload.config);

						await newGameAlgo.launchGame().then( value => {
							newGameAlgo.shutDownInternalEvents();
							this.gameMap.delete(newGameAlgo.roomID);
						}).catch(onrejected => {
							if (onrejected === '1') {
								console.log(" --- p1 left --- ");
								this.server.to(newGameAlgo.getPlayerSocketID(2)).emit('disconnection', `DISCONNECTED: ${newGameAlgo.getPlayerLogin(1)} quit the game :(`);
							}
							else if (onrejected === '2') {
								console.log(" --- p2 left --- ");
								this.server.to(newGameAlgo.getPlayerSocketID(1)).emit('disconnection', `DISCONNECTED: ${newGameAlgo.getPlayerLogin(2)} quit the game :(`);
							}
							if (onrejected === 'TIME') {
								console.log(" --- timeOut --- ");
								this.server.to(client.id).emit('disconnection', 'DISCONNECTED: timeout, try later');
							}
							if (onrejected === 'BLOCKED') {
								console.log(" --- bloked --- ");
								this.server.to(client.id).emit('disconnection', 'DISCONNECTED: stop breaking my stuff');
							}
							newGameAlgo.watchers.forEach((watchersID) => {
								if (watchersID)
									this.server.to(watchersID.id).emit('disconnection', 'DISCONNECTED: one of the players got disconnected');
							})
							newGameAlgo.shutDownInternalEvents();
							this.gameService.deleteGame(newGameAlgo.roomID); // deleteting from the DB
							this.gameMap.delete(newGameAlgo.roomID); // deleteting from the running games
						})
				}
			}
	}

	@SubscribeMessage('friendMatchMaking')
	async friendMatchMaker(client: Socket,  {inviteId, p1Id, p2Id, id, user, ballSpeed, paddleSize, duration}:
											{inviteId: number, p1Id: number, p2Id: number, id: number, user: string, ballSpeed: string, paddleSize: string, duration: string}) {
		return new Promise<GameAlgo>((resolve, rejects) => {
			for (const [key, gameItem] of this.gameMap) {
				if (gameItem.getStatus() === Status.LOCKED) {
					if (parseInt(gameItem.getPlayerID(1)) === p1Id || parseInt(gameItem.getPlayerID(1)) === p2Id)
						resolve(gameItem);
				}
			}
			rejects(undefined);
		}).then(async gameItem => {
			gameItem.initPlayer2({
				id: id ,
				login: user,
				avatar: (await this.gameService.getAvatarPath(id)).avatar,
				socketID: client.id,
				playerRole: "p1",
				playerSocket: client,
				isReady: false
			})
		}).catch(async onRejected => {
			const newGameDB = await this.gameService.registerNewGame('WAIT');
			if (newGameDB) {
				var newGameAlgo = new GameAlgo(this.gameService, this.server, newGameDB.game_id.toString(), Status.LOCKED);
				this.gameMap.set( newGameDB.game_id.toString(), newGameAlgo); // we set it in the gameMap so the player2 will be able to find it.
					console.log('created a new game --> ' + newGameDB.game_id.toString());
					newGameAlgo.initPlayer1({
						id: id ,
						login: user,
						avatar: (await this.gameService.getAvatarPath(id)).avatar,
						socketID: client.id,
						playerRole: "p1",
						playerSocket: client,
						isReady: false
					}, {
						ballSpeed: this.gameService.convertBallSpeed(ballSpeed),
						paddleSize: this.gameService.convertPaddleSize(paddleSize),
						duration: this.gameService.convertDuration(duration)
					});


					// then we launch the promise that will wait for all players to be properly set and settle
					await newGameAlgo.launchGame().then( value => {
						newGameAlgo.shutDownInternalEvents();
						this.gameMap.delete(newGameAlgo.roomID);
						this.gameService.eraseGameInvites(inviteId);
					}).catch(onrejected => {
						if (onrejected === '1') {
							console.log(" --- p1 left --- ");
							this.server.to(newGameAlgo.getPlayerSocketID(2)).emit('disconnection', `DISCONNECTED: ${newGameAlgo.getPlayerLogin(1)} quit the game :(`);
						}
						else if (onrejected === '2') {
							console.log(" --- p2 left --- ");
							this.server.to(newGameAlgo.getPlayerSocketID(1)).emit('disconnection', `DISCONNECTED: ${newGameAlgo.getPlayerLogin(2)} quit the game :(`);
						}
						if (onrejected === 'TIME') {
							console.log(" --- timeOut --- " + newGameAlgo.roomID);
							this.server.to(client.id).emit('disconnection', 'DISCONNECTED: timeout, try later');
						}
						if (onrejected === 'BLOCKED') {
							console.log(" --- bloked --- ");
							this.server.to(client.id).emit('disconnection', 'DISCONNECTED: stop breaking my stuff');
						}
						newGameAlgo.watchers.forEach((watchersID) => {
							if (watchersID)
								this.server.to(watchersID.id).emit('disconnection', 'DISCONNECTED: one of the players got disconnected');
						})
						newGameAlgo.shutDownInternalEvents();
						this.gameService.deleteGame(newGameAlgo.roomID); // deleteting from the DB
						this.gameService.eraseGameInvites(inviteId);
						this.gameMap.delete(newGameAlgo.roomID); // deleteting from the running games
					})
			}
		})
/*
		const findLockedGame = async (game: Map<string, GameAlgo>): Promise<boolean> => {
			for (const [key, gameItem] of game) {
				if (gameItem.getStatus() === Status.LOCKED) {
					if (parseInt(gameItem.getPlayerID(1)) === p1Id || parseInt(gameItem.getPlayerID(1)) === p2Id)
					{
						gameItem.initPlayer2({
							id: id ,
							login: user,
							avatar: (await this.gameService.getAvatarPath(id)).avatar,
							socketID: client.id,
							playerRole: "p1",
							playerSocket: client,
							isReady: false
						});
						console.log('adding player 2 --> ' + key);
						return (false);
					}
				}
			}
			return true;
		}
	*/
		/*
		if (await findLockedGame(this.gameMap)) // NO LOCKED GAME FOUND (LOCKED MEANS LOCKED FOR A SPECIFIC USER)
		{
			const newGameDB = await this.gameService.registerNewGame('WAIT');
			if (newGameDB) {
				var newGameAlgo = new GameAlgo(this.gameService, this.server, newGameDB.game_id.toString(), Status.LOCKED);
				this.gameMap.set( newGameDB.game_id.toString(), newGameAlgo); // we set it in the gameMap so the player2 will be able to find it.
					console.log('created a new game --> ' + newGameDB.game_id.toString());
					newGameAlgo.initPlayer1({
						id: id ,
						login: user,
						avatar: (await this.gameService.getAvatarPath(id)).avatar,
						socketID: client.id,
						playerRole: "p1",
						playerSocket: client,
						isReady: false
					}, undefined);

					// then we launch the promise that will wait for all players to be properly set and settle
					await newGameAlgo.launchGame().then( value => {
						newGameAlgo.shutDownInternalEvents();
						this.gameMap.delete(newGameAlgo.roomID);
					}).catch(onrejected => {
						if (onrejected === '1') {
							console.log(" --- p1 left --- ");
							this.server.to(newGameAlgo.getPlayerSocketID(2)).emit('disconnection', `DISCONNECTED: ${newGameAlgo.getPlayerLogin(1)} quit the game :(`);
						}
						else if (onrejected === '2') {
							console.log(" --- p2 left --- ");
							this.server.to(newGameAlgo.getPlayerSocketID(1)).emit('disconnection', `DISCONNECTED: ${newGameAlgo.getPlayerLogin(2)} quit the game :(`);
						}
						if (onrejected === 'TIME') {
							console.log(" --- timeOut --- " + newGameAlgo.roomID);
							this.server.to(client.id).emit('disconnection', 'DISCONNECTED: timeout, try later');
						}
						if (onrejected === 'BLOCKED') {
							console.log(" --- bloked --- ");
							this.server.to(client.id).emit('disconnection', 'DISCONNECTED: stop breaking my stuff');
						}
						newGameAlgo.watchers.forEach((watchersID) => {
							if (watchersID)
								this.server.to(watchersID.id).emit('disconnection', 'DISCONNECTED: one of the players got disconnected');
						})
						newGameAlgo.shutDownInternalEvents();
						this.gameService.deleteGame(newGameAlgo.roomID); // deleteting from the DB
						this.gameMap.delete(newGameAlgo.roomID); // deleteting from the running games
					})
			}
		}
		*/
	}

	@SubscribeMessage('getRuningGames')
	runingGamesList() {
		let keysTable: {game_id: string, p1:string, p1avatar:string, p2: string, p2avatar:string}[] = [];

		const assignKeysToTable = () => {
			// Parcours chaque noeud de la Map
			for (let [key, value] of this.gameMap) {
				if (value.getStatus() === Status.RUNNING)
					keysTable.push({
									game_id: key,
									p1: value.getPlayerLogin(1),
									p1avatar: value.getPlayerAvatar(1),
									p2: value.getPlayerLogin(2),
									p2avatar: value.getPlayerAvatar(2)
								});
			}
		}
		assignKeysToTable();
		this.server.emit('updateRuningGames', keysTable);
	}

	@SubscribeMessage('watchGame')
	async addWatcherToGame(client: Socket, gameId: string) {
		const temp = this.gameMap.get(gameId);

		if (temp && temp.getStatus() === Status.RUNNING)
			temp.addWatcherSocketID(client)
		/**
		 * here the client send the gameID (button on wich he clicked) we check if the game existe and is RUNNING
		 * if yes, we add the clientid to the watcher list so gameAlgo class will send him the gameData stuff too
		 */
	}


	async handleConnection(client: Socket, ...args: any[]) {
		if (client.handshake.auth.token && jwtConstants.jwt_secret) {
			try {
				const clientPayload = jwt.verify(client.handshake.auth.token, jwtConstants.jwt_secret);

				this.gameMap.forEach((game, roomID) => {

					if (game.getStatus() === Status.RUNNING) {
						if (clientPayload.sub && clientPayload.sub == game.getPlayerID(1)) { // player1
							client.join(roomID);
							this.server.to(client.id).emit('lockAndLoaded')
							game.playerChangeSocket(client, client.id, 1);
						}
						else if (clientPayload.sub && clientPayload.sub == game.getPlayerID(2)) { // player2
							client.join(roomID);
							this.server.to(client.id).emit('lockAndLoaded')
							game.playerChangeSocket(client, client.id, 2);
						}
						return;
						// console.log(`---> ICI: ${Status.RUNNING} = ${game.getStatus()} | ${clientPayload.sub} === ${game.getPlayerID(0)} | ${clientPayload.sub} === ${game.getPlayerID(1)}`);
					}
				})
			} catch (err) {
				console.error("IN HANDLE CONNECTION: token is broke ->" + err);
				console.log(`Client connected, token is : ${client.handshake.auth.token}`);
				client.disconnect(true);
			}
		}
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
		for (let [key, value] of this.gameMap) {
			if (value.getPlayerSocketID(1) === client.id && value.getStatus() === Status.ONE_PLAYER ){
				console.log('disconecte form the stuff');
				value.shutDownInternalEvents();
				this.gameService.deleteGame(value.roomID);
				this.gameMap.delete(value.roomID);
			}
		}
	}
}
