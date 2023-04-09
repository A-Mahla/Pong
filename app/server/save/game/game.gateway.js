"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
const game_types_1 = require("./game.types");
const game_algo_1 = require("./game.algo");
const common_1 = require("@nestjs/common");
const constants_1 = require("../auth/constants");
const jwt = require("jsonwebtoken");
let GameGateway = class GameGateway {
    constructor(gameService) {
        this.gameService = gameService;
        this.gameMap = new Map();
    }
    async matchMaker(client, clientPayload) {
        let gameToJoin;
        this.gameMap.forEach((game) => {
            if (game.getStatus() === game_types_1.Status.ONE_PLAYER) {
                gameToJoin = game;
                return;
            }
        });
        if (gameToJoin) {
            client.join(gameToJoin.roomID);
            gameToJoin.initPlayer2({
                id: parseInt(clientPayload.id),
                login: clientPayload.login,
                socketID: client.id,
                playerRole: "p2",
                playerSocket: client
            });
        }
        else {
            const newGameDB = await this.gameService.registerNewGame('WAIT');
            if (newGameDB) {
                const newGameAlgo = new game_algo_1.GameAlgo(this.gameService, this.server, newGameDB.game_id.toString());
                this.gameMap.set(newGameDB.game_id.toString(), newGameAlgo);
                newGameAlgo.initPlayer1({
                    id: parseInt(clientPayload.id),
                    login: clientPayload.login,
                    socketID: client.id,
                    playerRole: "p1",
                    playerSocket: client
                });
                await newGameAlgo.launchGame().then(value => {
                    console.log("OUI OUI OUI" + value);
                }).catch(onrejected => {
                    console.log("NON NON NON" + onrejected);
                    if (onrejected === 'TIME')
                        this.server.to(client.id).emit('timeOut');
                });
            }
        }
        if (gameToJoin && gameToJoin.getStatus() === game_types_1.Status.RUNNING)
            this.runingGamesList();
    }
    async runingGamesList() {
        const keysTable = [];
        const assignKeysToTable = () => {
            for (let [key, value] of this.gameMap) {
                if (value.getStatus() === game_types_1.Status.RUNNING)
                    keysTable.push(key);
            }
        };
        assignKeysToTable();
        this.server.emit('updateRuningGames', keysTable);
    }
    async addWatcherToGame(client, gameId) {
        const temp = this.gameMap.get(gameId);
        if (temp && temp.getStatus() === game_types_1.Status.RUNNING)
            temp.addWatcherSocketID(client.id);
    }
    async handleConnection(client, ...args) {
        if (client.handshake.auth.token && constants_1.jwtConstants.jwt_secret) {
            try {
                const clientPayload = jwt.verify(client.handshake.auth.token, constants_1.jwtConstants.jwt_secret);
                this.gameMap.forEach((game, roomID) => {
                    if (game.getStatus() === game_types_1.Status.RUNNING) {
                        if (clientPayload.sub && clientPayload.sub == game.getPlayerID(1)) {
                            client.join(roomID);
                            game.playerChangeSocket(client, client.id, 1);
                            this.server.to(client.id).emit('lockAndLoaded');
                        }
                        else if (clientPayload.sub && clientPayload.sub == game.getPlayerID(2)) {
                            client.join(roomID);
                            game.playerChangeSocket(client, client.id, 2);
                            this.server.to(client.id).emit('lockAndLoaded');
                        }
                        return;
                    }
                });
            }
            catch (err) {
                console.error("IN HANDLE CONNECTION: token is broke ->" + err);
                console.log(`Client connected, token is : ${client.handshake.auth.token}`);
                client.disconnect(true);
            }
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('automatikMatchMaking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "matchMaker", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getRuningGames'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "runingGamesList", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('watchGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "addWatcherToGame", null);
GameGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ namespace: 'gameTransaction' }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map