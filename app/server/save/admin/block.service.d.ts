import { PrismaService } from "src/prisma/prisma.service";
export declare class BlockService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getBlockedUsers(userId: number): Promise<import(".prisma/client").Blocked[]>;
    createBlockRelation(blockData: {
        userId: number;
        blockedUserId: number;
    }): Promise<import(".prisma/client").Blocked>;
}
