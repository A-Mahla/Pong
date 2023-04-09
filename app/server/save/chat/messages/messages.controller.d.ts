import { UsersService } from "src/users/users.service";
import { MessageService } from "./messages.service";
export declare class MessageController {
    private readonly messageService;
    private readonly userService;
    constructor(messageService: MessageService, userService: UsersService);
    getRoomMessages(roomId: number): Promise<import(".prisma/client").Message[]>;
    getDirectMessages(req: any): Promise<import(".prisma/client").Direct_Message[]>;
}
