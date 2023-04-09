"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwofaModule = void 0;
const twofa_service_1 = require("./twofa.service");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const twofa_controller_1 = require("./twofa.controller");
const game_service_1 = require("../game/game.service");
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const prisma_module_1 = require("../prisma/prisma.module");
const jwt_strategy_1 = require("../auth/jwt.strategy");
const _2fa_jwt_strategy_1 = require("../auth/2fa-jwt.strategy");
let TwofaModule = class TwofaModule {
};
TwofaModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, (0, common_1.forwardRef)(() => auth_module_1.AuthModule)],
        controllers: [twofa_controller_1.TwofaController],
        providers: [
            twofa_service_1.TwoFAService,
            users_service_1.UsersService,
            prisma_service_1.PrismaService,
            game_service_1.GameService,
            _2fa_jwt_strategy_1.TwoFATokenStrategy,
            jwt_strategy_1.JwtStrategy,
        ]
    })
], TwofaModule);
exports.TwofaModule = TwofaModule;
//# sourceMappingURL=twofa.module.js.map