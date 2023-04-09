import { RoomsService } from "./rooms.service";
export declare class RoomsController {
    private readonly roomService;
    constructor(roomService: RoomsService);
    getAllRooms(): Promise<(import(".prisma/client").Room & {
        members: import(".prisma/client").User_Room[];
    })[]>;
    getRoomOwner(roomId: number): Promise<import(".prisma/client").User | null>;
    getRoomsByName(name: string): Promise<import(".prisma/client").Room[]>;
}
