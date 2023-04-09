import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { RoomsService } from "../rooms/rooms.service";
export declare class MessageService {
    private prisma;
    private userService;
    private roomService;
    constructor(prisma: PrismaService, userService: UsersService, roomService: RoomsService);
    createMessage(senderId: number, roomId: number, content: string): Promise<import(".prisma/client").Message>;
    getRoomMessages(roomId: number): Promise<import(".prisma/client").Message[]>;
    createDirectMessage(senderId: number, recipientId: number, content: string): Promise<import(".prisma/client").Direct_Message>;
    getUserDirectMessages(userId: number): Promise<import(".prisma/client").Direct_Message[]>;
    getUserDirectMessagesLogin(userLogin: string): Promise<import(".prisma/client").Direct_Message[]>;
}
