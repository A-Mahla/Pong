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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const game_service_1 = require("./game.service");
let GameController = class GameController {
    constructor(gameService) {
        this.gameService = gameService;
    }
    async registerNewGame() {
        return (this.gameService.registerNewGame('--'));
    }
    async registerNewPlayer(game_id, user) {
        return (this.gameService.registerNewPlayer(game_id, parseInt(user.id), parseInt(user.score)));
    }
    async getGameWaitingList() {
        return (this.gameService.gamesbyStatus('WAIT'));
    }
    async getGameHistory(req) {
        if (!req.user.sub)
            throw common_1.BadRequestException;
        const raw = await this.gameService.gameHistory(req.user.sub);
        return this.gameService.parseGameHistory(raw);
    }
    async getnbGames(user_id) {
        return (this.gameService.getNbGames(user_id));
    }
    async getnbVictory(user_id) {
        return (this.gameService.getVictoryLossCountForUser(user_id, true));
    }
    async getnbLoss(user_id) {
        return (this.gameService.getVictoryLossCountForUser(user_id, false));
    }
    async createNewGameFull(players) {
        const newGame = await this.gameService.registerNewGame("--");
        await this.gameService.registerNewPlayer(parseInt(newGame.game_id.toString()), parseInt(players.player1.id), players.player1.score);
        await this.gameService.registerNewPlayer(parseInt(newGame.game_id.toString()), parseInt(players.player2.id), players.player2.score);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('newGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "registerNewGame", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('userInGame/:gameId'),
    __param(0, (0, common_1.Param)('gameId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "registerNewPlayer", null);
__decorate([
    (0, common_1.Get)('gamewatinglist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getGameWaitingList", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('gamehistory'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getGameHistory", null);
__decorate([
    (0, common_1.Get)('stats/nbGames/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getnbGames", null);
__decorate([
    (0, common_1.Get)('stats/nbVictory/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getnbVictory", null);
__decorate([
    (0, common_1.Get)('stats/nbLoss/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "getnbLoss", null);
__decorate([
    (0, common_1.Post)('test/createFullGame'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GameController.prototype, "createNewGameFull", null);
GameController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
exports.GameController = GameController;
//# sourceMappingURL=game.controller.js.map