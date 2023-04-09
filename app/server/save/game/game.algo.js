"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAlgo = void 0;
const game_types_1 = require("./game.types");
const events_1 = require("events");
class GameAlgo {
    constructor(gameService, server, roomID) {
        this.gameService = gameService;
        this.server = server;
        this.roomID = roomID;
        this.gameModel = game_types_1.gamePatron;
        this.watchers = [];
        this.gameData = this.initGameData(this.gameModel);
        this.status = game_types_1.Status.EMPTY;
        this.internalEvents = new events_1.EventEmitter();
    }
    async launchGame() {
        return (new Promise((resolve, rejects) => {
            const checkPlayer = (count, timeout) => {
                if (this.player1 && this.player2 && this.player2.id != this.player1.id) {
                    this.server.to(this.player1.socketID).emit('lockAndLoaded');
                    this.server.to(this.player2.socketID).emit('lockAndLoaded');
                    this.server.to(this.player1.socketID).emit('initSetup', this.gameData);
                    this.server.to(this.player2.socketID).emit('initSetup', this.rotateGameData(this.gameData));
                    this.startGame().then(solved => {
                        this.gameService.endGameDBwrites(this.roomID, this.player1, this.player2, this.gameData);
                        this.status = game_types_1.Status.OVER;
                        resolve(solved);
                    })
                        .catch(rejected => {
                        this.status = game_types_1.Status.OVER;
                        rejects(rejected);
                    });
                }
                else if (count > 600) {
                    clearTimeout(timeout);
                    this.status = game_types_1.Status.OVER;
                    return rejects('TIME');
                }
                else {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        checkPlayer(++count, timeout);
                    }, 100);
                }
            };
            let count = 0;
            let timeout = 0;
            checkPlayer(count, timeout);
        }));
    }
    async startGame() {
        return new Promise((resolve, rejects) => {
            this.internalEvents.on('start', () => {
                clearInterval(this.interval);
                this.interval = setInterval(this.computeGame.bind(this), 16);
            });
            this.internalEvents.on('pause', (countDown) => {
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    this.countDown(countDown);
                }, 1000);
            });
            this.internalEvents.on('stop', (endofgame) => {
                clearInterval(this.interval);
                if (endofgame === '0')
                    resolve(endofgame);
                else
                    rejects(endofgame);
            });
            this.internalEvents.emit('pause', (10));
            this.status = game_types_1.Status.RUNNING;
        });
    }
    computeGame() {
        this.gameData.ball.x += this.gameData.ball.speed.x;
        this.gameData.ball.y += this.gameData.ball.speed.y;
        if (this.gameData.ball.y > this.gameModel.canvasHeight || this.gameData.ball.y < 0) {
            this.gameData.ball.speed.y *= -1;
        }
        if (this.gameData.ball.x < 15) {
            let bornInfP1 = (this.gameData.player1.y - this.gameModel.playerHeight / 2);
            let bornSupP1 = (this.gameData.player1.y + this.gameModel.playerHeight / 2);
            if (this.gameData.ball.y > bornInfP1 && this.gameData.ball.y < bornSupP1) {
                this.gameData.ball.speed.x *= -1, 2;
            }
            else {
                this.gameData.player2.score += 1;
                this.gameData.ball.x = this.gameModel.canvasWidth / 2;
                this.gameData.ball.y = this.gameModel.canvasHeight / 2;
                this.internalEvents.emit('pause', 3);
            }
        }
        if (this.gameData.ball.x > (this.gameModel.canvasWidth - 15)) {
            let bornInfP2 = (this.gameData.player2.y - (this.gameModel.playerHeight / 2));
            let bornSupP2 = (this.gameData.player2.y + (this.gameModel.playerHeight / 2));
            if (this.gameData.ball.y > bornInfP2 && this.gameData.ball.y < bornSupP2) {
                this.gameData.ball.speed.x *= -1, 2;
            }
            else {
                this.gameData.player1.score += 1;
                this.gameData.ball.x = this.gameModel.canvasWidth / 2;
                this.gameData.ball.y = this.gameModel.canvasHeight / 2;
                this.internalEvents.emit('pause', 3);
            }
        }
        if (++this.gameData.roomInfo.timer == 1875) {
            this.server.to(this.player1.socketID).volatile.emit('gameOver', this.gameData);
            this.server.to(this.player2.socketID).volatile.emit('gameOver', this.rotateGameData(this.gameData));
            this.status = game_types_1.Status.OVER;
            this.internalEvents.emit('stop', '0');
            return;
        }
        this.server.to(this.player1.socketID).volatile.emit('updateClient', this.gameData);
        this.server.to(this.player2.socketID).volatile.emit('updateClient', this.rotateGameData(this.gameData));
        this.watchers.forEach((socketID) => {
            this.server.to(socketID).volatile.emit('updateClient', this.gameData);
        });
    }
    countDown(countDown) {
        this.gameData.roomInfo.countDown = countDown;
        this.server.to(this.player1.socketID).volatile.emit('updateClient', this.gameData);
        this.server.to(this.player2.socketID).volatile.emit('updateClient', this.rotateGameData(this.gameData));
        if (!countDown) {
            this.gameData.roomInfo.countDown = -1;
            this.internalEvents.emit('start');
        }
        else
            this.internalEvents.emit('pause', (--countDown));
    }
    initPlayer1(player) {
        this.player1 = player;
        this.gameData.player1.login = this.player1.login;
        this.status = game_types_1.Status.ONE_PLAYER;
        this.player1.playerSocket.once('quitGame', (socket) => {
            this.internalEvents.emit('stop', '1');
        });
        this.player1.playerSocket.on('paddlePos', (y, socket) => {
            this.gameData.player1.y = y;
            this.gameData.player1.timeout = Date.now();
        });
    }
    initPlayer2(player) {
        this.player2 = player;
        this.gameData.player2.login = this.player2.login;
        this.status = game_types_1.Status.TWO_PLAYER;
        this.player2.playerSocket.once('quitGame', (socket) => {
            this.internalEvents.emit('stop', '2');
        });
        this.player2.playerSocket.on('paddlePos', (y, socket) => {
            this.gameData.player2.y = y;
            this.gameData.player2.timeout = Date.now();
        });
    }
    getStatus() {
        return (this.status);
    }
    getPlayerID(player1ou2) {
        if (player1ou2 === 1)
            return this.player1.id.toString();
        else if (player1ou2 === 2)
            return this.player2.id.toString();
        else
            return "error";
    }
    playerChangeSocket(playerSocket, socketID, player1ou2) {
        if (player1ou2 === 1) {
            this.player1.playerSocket = playerSocket;
            this.player1.socketID = socketID;
            this.player1.playerSocket.on('paddlePos', (y, socket) => {
                this.gameData.player1.y = y;
                this.gameData.player1.timeout = Date.now();
            });
        }
        else if (player1ou2 === 2) {
            this.player2.playerSocket = playerSocket;
            this.player2.socketID = socketID;
            this.player2.playerSocket.on('paddlePos', (y, socket) => {
                this.gameData.player2.y = y;
                this.gameData.player2.timeout = Date.now();
            });
        }
    }
    addWatcherSocketID(newWatcherSocketId) {
        this.watchers.push(newWatcherSocketId);
        this.server.to(newWatcherSocketId).emit('initSetup', this.gameData);
    }
    initGameData(gamePatron) {
        return ({
            roomInfo: {
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
        });
    }
    rotateGameData(gameData) {
        let temp = Object.assign(Object.assign({}, gameData), { player1: Object.assign({}, gameData.player2), player2: Object.assign({}, gameData.player1), ball: Object.assign(Object.assign({}, gameData.ball), { x: (this.gameModel.canvasWidth / 2) - (gameData.ball.x - (this.gameModel.canvasWidth / 2)) }) });
        return temp;
    }
    playersTimeout() {
        if ((Date.now() - this.gameData.player1.timeout) > 10000) {
            this.gameData.player1.score = 0;
            this.gameData.player2.score += 1;
            return (true);
        }
        else if (((Date.now() - this.gameData.player2.timeout) > 10000)) {
            this.gameData.player1.score += 1;
            this.gameData.player2.score = 0;
            return (true);
        }
        else
            return (false);
    }
}
exports.GameAlgo = GameAlgo;
//# sourceMappingURL=game.algo.js.map