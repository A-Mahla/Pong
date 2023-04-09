"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const game_service_1 = require("./game.service");
const game_controller_1 = require("./game.controller");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const game_algo_1 = require("./game.algo");
let GameModule = class GameModule {
};
GameModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, (0, common_1.forwardRef)(() => auth_module_1.AuthModule)],
        providers: [game_service_1.GameService, game_algo_1.GameAlgo, jwt_1.JwtService],
        controllers: [game_controller_1.GameController],
        exports: [game_service_1.GameService]
    })
], GameModule);
exports.GameModule = GameModule;
//# sourceMappingURL=game.module.js.map