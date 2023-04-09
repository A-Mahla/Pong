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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const messages_service_1 = require("./messages/messages.service");
const rooms_service_1 = require("./rooms/rooms.service");
const friends_service_1 = require("./friends/friends.service");
let ChatService = class ChatService {
    constructor(roomService, userService, messageService, friendService) {
        this.roomService = roomService;
        this.userService = userService;
        this.messageService = messageService;
        this.friendService = friendService;
    }
    async createRoom(server, client, payload) {
        console.log('payload in CREATE ROOM: ', payload);
        const newRoom = await this.roomService.createRoom(payload);
        client.join(newRoom.room_id.toString() + payload.name);
        server.to(client.id).emit('roomCreated', { name: payload.name, id: newRoom === null || newRoom === void 0 ? void 0 : newRoom.room_id, messages: [] });
        return newRoom;
    }
    async manageDirectMessage(server, client, payload) {
        if (payload.recipient_id !== undefined) {
            console.log('payload in create direct message: ', payload);
            const newDirectMessage = await this.messageService.createDirectMessage(payload.sender_id, payload.recipient_id, payload.content);
            server.to(payload.recipient_id.toString()).emit('directMessage', newDirectMessage);
            server.to(client.id).emit('directMessage', newDirectMessage);
            console.log('payload direct message: ', payload);
            console.log('newDirectMessage: ', newDirectMessage);
        }
    }
    async manageRoomMessage(server, client, payload) {
        console.log("payload:\n\n", payload);
        if (payload.room !== undefined) {
            console.log('client rooms in handle MESSAGE', client.rooms);
            const newMessage = await this.messageService.createMessage(payload.sender_id, payload.room.id, payload.content);
            server.to(payload.room.id.toString() + payload.room.name).emit('roomMessage', newMessage);
            console.log('payload in message handler', payload);
        }
        return payload;
    }
    async leaveRoom(server, client, payload) {
        const message = {
            content: `${payload.user_login} leaved the room`,
            sender_id: payload.user_id,
            room: {
                name: payload.room_name,
                id: payload.room_id,
            }
        };
        console.log('leaveRoom payload: \n\n\n\n', payload, message);
        const newMessage = await this.messageService.createMessage(payload.user_id, payload.room_id, `${payload.user_login} leaved the room`);
        server.to(client.id).emit('roomLeaved', { room_id: payload.room_id, room_name: payload.room_name });
        return this.roomService.deleteRelation(payload.user_id, payload.room_id);
    }
    async join(client, userId) {
        const rooms = await this.userService.findAllUserRooms(userId);
        client.join(userId.toString());
        console.log('client rooms in handle JOIN', client.rooms);
        for (let room of rooms) {
            client.join(room.room_id.toString() + room.name);
            console.log(room.room_id.toString() + room.name);
        }
        console.log('rooms: ', rooms);
    }
    async joinRoom(server, client, payload) {
        client.join(payload.room_id.toString() + payload.room_name);
        const room = await this.roomService.getRoomById(payload.room_id);
        console.log('room in JOIN: ', room);
        server.to(client.id).emit('roomJoined', room);
        return this.userService.joinRoom(payload.user_id, payload.room_id);
    }
    async sendFriendRequest(server, client, payload) {
        const existingRequest = await this.friendService.isExisting({ user1_id: payload.user2_id, user2_id: payload.user1_id });
        console.log('request existing ? : ', existingRequest);
        if (existingRequest === true)
            return 'the receiver already send you a friend request';
        const newFriendRequest = await this.friendService.createFriendRequest(payload);
        console.log('dans sendFriendRequest\n\n\n\n\n\n\n\n\n\nn\n\n\n\n\n\n\n');
        server.to(payload.user2_id.toString()).to(client.id).emit('friendRequest', newFriendRequest);
        return newFriendRequest;
    }
    async acceptFriendRequest(server, client, friendRequestId) {
        const friendAcceptedRelation = await this.friendService.acceptFriendRequest(friendRequestId);
        if (friendAcceptedRelation === null)
            return;
        console.log('friendAcceptedRelation: ', friendAcceptedRelation);
        server.to(friendAcceptedRelation.user1.id.toString()).emit('newFriend', friendAcceptedRelation.user2);
        server.to(friendAcceptedRelation.user2.id.toString()).emit('newFriend', friendAcceptedRelation.user1);
        return friendAcceptedRelation;
    }
    async declineFriendRequest(server, client, payload) {
        await this.friendService.declineFriendRequest(payload.friendRequestId);
        server.to(payload.senderId.toString()).emit('declineFriend', payload.friendRequestId);
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService,
        users_service_1.UsersService,
        messages_service_1.MessageService,
        friends_service_1.FriendsService])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map