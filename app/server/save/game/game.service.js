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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GameService = class GameService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async endGameDBwrites(gameID, player1, player2, gameData) {
        this.registerNewPlayer(parseInt(gameID), player1.id, gameData.player1.score);
        this.registerNewPlayer(parseInt(gameID), player2.id, gameData.player2.score);
    }
    async registerNewGame(status) {
        return this.prisma.games.create({
            data: {
                status: status
            }
        }).catch((e) => { throw e; });
    }
    async registerNewPlayer(game_id, user_id, score) {
        const newUserGame = {
            game_id: game_id,
            user_id: user_id,
            score: score,
        };
        const newPlayer = await this.prisma.user_Game.create({
            data: newUserGame
        }).catch((e) => { throw new common_1.BadRequestException(e); });
        if (await this.checkPlayerInGame(game_id) === 2) {
            await this.prisma.games.update({
                where: {
                    game_id: game_id
                },
                data: {
                    status: 'OK'
                }
            }).catch((e) => {
                throw new common_1.BadRequestException(e);
            });
        }
        return newPlayer;
    }
    async checkPlayerInGame(game_id) {
        return await this.prisma.user_Game.count({
            where: {
                game_id: {
                    equals: game_id,
                },
            },
        }).catch((e) => { throw e; });
    }
    async gamesbyStatus(statusTofind) {
        return (this.prisma.games.findMany({
            where: {
                status: statusTofind
            }
        }));
    }
    async gameHistory(userId) {
        const games = await this.prisma.user_Game.findMany({
            where: {
                user_id: userId,
            },
            include: {
                game: {
                    include: {
                        players: {
                            include: {
                                player: true,
                            },
                        }
                    },
                },
            },
            orderBy: {
                game: {
                    createdAt: 'desc',
                },
            },
        });
        return games;
    }
    parseGameHistory(raw) {
        let parsedData = [];
        raw.forEach((userGame, index) => {
            let temp = {
                index: 0,
                l1: '',
                a1: '',
                s1: 0,
                l2: '',
                s2: 0,
                a2: '',
            };
            temp.index = userGame.game_id;
            if (userGame.user_id == userGame.game.players[0].player.id) {
                temp.l1 = userGame.game.players[0].player.login;
                temp.a1 = userGame.game.players[0].player.avatar;
                temp.s1 = userGame.game.players[0].score;
                temp.l2 = userGame.game.players[1].player.login;
                temp.a2 = userGame.game.players[1].player.avatar;
                temp.s2 = userGame.game.players[1].score;
            }
            else {
                temp.l1 = userGame.game.players[1].player.login;
                temp.a1 = userGame.game.players[1].player.avatar;
                temp.s1 = userGame.game.players[1].score,
                    temp.l2 = userGame.game.players[0].player.login,
                    temp.s2 = userGame.game.players[0].score;
                temp.a2 = userGame.game.players[0].player.avatar;
            }
            parsedData.push(temp);
        });
        return {
            history: parsedData
        };
    }
    async getVictoryLossCountForUser(userId, InfSup) {
        const games = await this.prisma.user_Game.findMany({
            where: {
                user_id: userId,
            },
            include: {
                game: {
                    include: {
                        players: true,
                    },
                },
            },
        });
        let victories = 0;
        games.forEach((game) => {
            var _a;
            const otherPlayers = game.game.players.filter((player) => player.user_id !== userId);
            const otherPlayerScore = ((_a = otherPlayers[0]) === null || _a === void 0 ? void 0 : _a.score) || 0;
            if (InfSup && game.score > otherPlayerScore)
                victories++;
            else if (!InfSup && game.score < otherPlayerScore)
                victories++;
        });
        return victories;
    }
    async getNbGames(user_id) {
        const nbGames = await this.prisma.user_Game.count({
            where: {
                user_id: {
                    equals: user_id
                }
            }
        }).catch((e) => { throw e; });
        return nbGames;
    }
    async updateGamestatus(game_id, status) {
        return this.prisma.games.update({
            where: {
                game_id: game_id
            },
            data: {
                status: status
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
    }
};
GameService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map