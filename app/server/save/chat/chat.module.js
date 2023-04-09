"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const rooms_controller_1 = require("./rooms/rooms.controller");
const rooms_service_1 = require("./rooms/rooms.service");
const users_service_1 = require("../users/users.service");
const game_service_1 = require("../game/game.service");
const messages_service_1 = require("./messages/messages.service");
const messages_controller_1 = require("./messages/messages.controller");
const friends_controller_1 = require("./friends/friends.controller");
const friends_service_1 = require("./friends/friends.service");
const admin_controller_1 = require("../admin/admin.controller");
const block_service_1 = require("../admin/block.service");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [rooms_controller_1.RoomsController, messages_controller_1.MessageController, friends_controller_1.FriendsController, admin_controller_1.AdminController],
        providers: [users_service_1.UsersService, rooms_service_1.RoomsService, game_service_1.GameService, messages_service_1.MessageService, friends_service_1.FriendsService, block_service_1.BlockService]
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map