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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const users_service_1 = require("../users/users.service");
const rooms_service_1 = require("./rooms/rooms.service");
const messages_service_1 = require("./messages/messages.service");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    constructor(roomService, userService, messageService, chatService) {
        this.roomService = roomService;
        this.userService = userService;
        this.messageService = messageService;
        this.chatService = chatService;
    }
    async handleDirectMessage(client, payload) {
        console.log('payload: ', payload);
        return await this.chatService.manageDirectMessage(this.server, client, payload);
    }
    async handleRoomMessage(client, payload) {
        console.log('payload: ', payload);
        return await this.chatService.manageRoomMessage(this.server, client, payload);
    }
    handleCreateRoom(client, payload) {
        return this.chatService.createRoom(this.server, client, payload);
    }
    async handleLeaveRoom(client, payload) {
        return await this.chatService.leaveRoom(this.server, client, payload);
    }
    async handleJoin(client, id) {
        return this.chatService.join(client, id);
    }
    async handleJoinRoom(client, payload) {
        return this.chatService.joinRoom(this.server, client, payload);
    }
    async handleAddFriend(client, friendRequestId) {
        console.log('friendRequestId: ', friendRequestId);
        return this.chatService.acceptFriendRequest(this.server, client, friendRequestId);
    }
    async handleDeclineFriend(client, payload) {
        return this.chatService.declineFriendRequest(this.server, client, payload);
    }
    async handleFriendRequest(client, payload) {
        return this.chatService.sendFriendRequest(this.server, client, payload);
    }
    afterInit(server) {
        console.log('Initialized');
    }
    handleConnection(client, ...args) {
        console.log('args: ', args);
        console.log(`Client connected: ${client.id}`);
        this.server.to(client.id).emit('connected');
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('directMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDirectMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('roomMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRoomMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleCreateRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acceptFriend'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAddFriend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('declineFriend'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDeclineFriend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('friendRequest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleFriendRequest", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: 'chat' }),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        users_service_1.UsersService,
        messages_service_1.MessageService,
        chat_service_1.ChatService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map