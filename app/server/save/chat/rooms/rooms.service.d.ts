import { PrismaService } from "src/prisma/prisma.service";
import { Room, User, User_Room } from "@prisma/client";
import { CreateRoomData } from "../Chat.types";
import { UsersService } from "src/users/users.service";
export declare class RoomsService {
    private prisma;
    private userService;
    constructor(prisma: PrismaService, userService: UsersService);
    createRoom(roomDetails: CreateRoomData): Promise<Room | null>;
    findAll(): Promise<(Room & {
        members: User_Room[];
    })[]>;
    getRoomById(roomId: number): Promise<(Room & {
        messages: import(".prisma/client").Message[];
    }) | null>;
    getRoomOwner(roomId: number): Promise<User | null>;
    findManyRooms(name: string): Promise<Room[]>;
    deleteRelation(userId: number, roomId: number): Promise<User_Room>;
}
