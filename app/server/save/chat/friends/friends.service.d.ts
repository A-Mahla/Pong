import { PrismaService } from "src/prisma/prisma.service";
import { FriendRequestData } from "../Chat.types";
export declare class FriendsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    acceptFriendRequest(friendRequestId: number): Promise<{
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
    } | null>;
    declineFriendRequest(friendRequestId: number): Promise<void>;
    getFriends(userId: number): Promise<{
        id: number;
        login: string;
        avatar: string | null;
    }[]>;
    getFriendRequests(userId: number): Promise<{
        id: number;
        user1Login: string;
        user1Id: number;
        user2Login: string;
        user2Id: number;
        status: string;
        createdAt: Date;
    }[]>;
    createFriendRequest(friendRequestData: FriendRequestData): Promise<true | {
        id: number;
        user1Login: string;
        user1Id: number;
        user2Login: string;
        user2Id: number;
        status: string;
        createdAt: Date;
    }>;
    isExisting(friendRequestData: FriendRequestData): Promise<boolean>;
}
