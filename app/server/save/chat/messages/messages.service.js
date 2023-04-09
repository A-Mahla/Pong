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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const users_service_1 = require("../../users/users.service");
const rooms_service_1 = require("../rooms/rooms.service");
const common_2 = require("@nestjs/common");
let MessageService = class MessageService {
    constructor(prisma, userService, roomService) {
        this.prisma = prisma;
        this.userService = userService;
        this.roomService = roomService;
    }
    async createMessage(senderId, roomId, content) {
        console.log('createMessage datas: ', senderId, roomId, content);
        return await this.prisma.message.create({
            data: {
                sender_id: senderId,
                room_id: roomId,
                content: content,
            }
        }).catch((e) => {
            throw new common_2.BadRequestException(e);
        });
    }
    async getRoomMessages(roomId) {
        return await this.prisma.message.findMany({
            where: {
                room_id: roomId
            }
        }).catch((e) => {
            throw new common_2.BadRequestException(e);
        });
    }
    async createDirectMessage(senderId, recipientId, content) {
        console.log('in create message: ', senderId, recipientId, content);
        return await this.prisma.direct_Message.create({
            data: {
                sender_id: senderId,
                recipient_id: recipientId,
                content: content
            }
        }).catch((e) => {
            throw new common_2.BadRequestException(e);
        });
    }
    async getUserDirectMessages(userId) {
        return await this.prisma.direct_Message.findMany({
            where: {
                OR: [
                    {
                        recipient_id: userId
                    },
                    {
                        sender_id: userId
                    },
                ]
            }
        }).catch((e) => {
            throw new common_2.BadRequestException(e);
        });
    }
    async getUserDirectMessagesLogin(userLogin) {
        const recipient = await this.userService.findOneUser(userLogin);
        return await this.prisma.direct_Message.findMany({
            where: {
                recipient_id: recipient.id
            }
        }).catch((e) => {
            throw new common_2.BadRequestException(e);
        });
    }
};
MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        rooms_service_1.RoomsService])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=messages.service.js.map