import { Room } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/users.service";
import { CreateRoomData, MessageData, LeaveRoomData, JoinRoomData, FriendRequestData } from "./Chat.types";
import { MessageService } from "./messages/messages.service";
import { RoomsService } from "./rooms/rooms.service";
import { FriendsService } from "./friends/friends.service";
export declare class ChatService {
    private readonly roomService;
    private readonly userService;
    private readonly messageService;
    private readonly friendService;
    constructor(roomService: RoomsService, userService: UsersService, messageService: MessageService, friendService: FriendsService);
    createRoom(server: Server, client: Socket, payload: CreateRoomData): Promise<Room | null>;
    manageDirectMessage(server: Server, client: Socket, payload: MessageData): Promise<void>;
    manageRoomMessage(server: Server, client: Socket, payload: MessageData): Promise<MessageData>;
    leaveRoom(server: Server, client: Socket, payload: LeaveRoomData): Promise<import(".prisma/client").User_Room>;
    join(client: Socket, userId: number): Promise<void>;
    joinRoom(server: Server, client: Socket, payload: JoinRoomData): Promise<import(".prisma/client").User_Room>;
    sendFriendRequest(server: Server, client: Socket, payload: FriendRequestData): Promise<true | "the receiver already send you a friend request" | {
        id: number;
        user1Login: string;
        user1Id: number;
        user2Login: string;
        user2Id: number;
        status: string;
        createdAt: Date;
    }>;
    acceptFriendRequest(server: Server, client: Socket, friendRequestId: number): Promise<{
        id: number;
        user1: {
            login: string;
            avatar: string | null;
            id: number;
        };
        user2: {
            login: string;
            avatar: string | null;
            id: number;
        };
    } | undefined>;
    declineFriendRequest(server: Server, client: Socket, payload: {
        senderId: number;
        friendRequestId: number;
    }): Promise<void>;
}
