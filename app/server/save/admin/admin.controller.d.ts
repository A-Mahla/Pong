import { BlockService } from "./block.service";
export declare class AdminController {
    private readonly blockService;
    constructor(blockService: BlockService);
    handleBlock(req: any, blockedUserId: number): Promise<import(".prisma/client").Blocked>;
    getBlockedUsers(req: any): Promise<import(".prisma/client").Blocked[]>;
}
