import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from './rooms/rooms.service';
import { CreateRoomData, FriendRequestData, JoinRoomData, MessageData } from './Chat.types';
import { MessageService } from './messages/messages.service';
import { ChatService } from './chat.service';
import { LeaveRoomData } from './Chat.types';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomService;
    private readonly userService;
    private readonly messageService;
    private readonly chatService;
    constructor(roomService: RoomsService, userService: UsersService, messageService: MessageService, chatService: ChatService);
    server: Server;
    handleDirectMessage(client: any, payload: MessageData): Promise<void>;
    handleRoomMessage(client: any, payload: MessageData): Promise<MessageData>;
    handleCreateRoom(client: any, payload: CreateRoomData): Promise<import(".prisma/client").Room | null>;
    handleLeaveRoom(client: any, payload: LeaveRoomData): Promise<import(".prisma/client").User_Room>;
    handleJoin(client: Socket, id: number): Promise<void>;
    handleJoinRoom(client: Socket, payload: JoinRoomData): Promise<import(".prisma/client").User_Room>;
    handleAddFriend(client: Socket, friendRequestId: number): Promise<{
        id: number;
        user1: {
            id: number;
            login: string;
            avatar: string | null;
        };
        user2: {
            id: number;
            login: string;
            avatar: string | null;
        };
    } | undefined>;
    handleDeclineFriend(client: Socket, payload: {
        senderId: number;
        friendRequestId: number;
    }): Promise<void>;
    handleFriendRequest(client: Socket, payload: FriendRequestData): Promise<true | "the receiver already send you a friend request" | {
        id: number;
        user1Login: string;
        user1Id: number;
        user2Login: string;
        user2Id: number;
        status: string;
        createdAt: Date;
    }>;
    afterInit(server: Server): any;
    handleConnection(client: Socket, ...args: any[]): any;
    handleDisconnect(client: Socket): any;
}
