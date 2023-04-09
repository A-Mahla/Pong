import { FriendsService } from "./friends.service";
export declare class FriendsController {
    private readonly friendService;
    constructor(friendService: FriendsService);
    handleGetFriends(req: any): Promise<{
        id: number;
        login: string;
        avatar: string | null;
    }[]>;
    getFriendsRequests(req: any): Promise<{
        id: number;
        user1Login: string;
        user1Id: number;
        user2Login: string;
        user2Id: number;
        status: string;
        createdAt: Date;
    }[]>;
    sendFriendRequest(req: any, friendLogin: number): Promise<true | {
        id: number;
        user1Login: string;
        user1Id: number;
        user2Login: string;
        user2Id: number;
        status: string;
        createdAt: Date;
    }>;
}
