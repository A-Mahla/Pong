"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const chat_gateway_1 = require("./chat/chat.gateway");
const jwt_1 = require("@nestjs/jwt");
const chat_module_1 = require("./chat/chat.module");
const rooms_service_1 = require("./chat/rooms/rooms.service");
const prisma_service_1 = require("./prisma/prisma.service");
const game_module_1 = require("./game/game.module");
const game_service_1 = require("./game/game.service");
const game_gateway_1 = require("./game/game.gateway");
const messages_service_1 = require("./chat/messages/messages.service");
const chat_service_1 = require("./chat/chat.service");
const twofa_module_1 = require("./twofa/twofa.module");
const game_algo_1 = require("./game/game.algo");
const friends_service_1 = require("./chat/friends/friends.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule,
            chat_module_1.ChatModule,
            game_module_1.GameModule,
            twofa_module_1.TwofaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            prisma_service_1.PrismaService,
            rooms_service_1.RoomsService,
            messages_service_1.MessageService,
            chat_service_1.ChatService,
            chat_gateway_1.ChatGateway,
            game_service_1.GameService,
            game_service_1.GameService,
            game_gateway_1.GameGateway,
            game_algo_1.GameAlgo,
            friends_service_1.FriendsService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map