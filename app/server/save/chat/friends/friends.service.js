"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FriendsService = class FriendsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async acceptFriendRequest(friendRequestId) {
        await this.prisma.friend.update({
            where: {
                id: friendRequestId
            },
            data: {
                status: 'accepted'
            },
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
        return await this, this.prisma.friend.findUnique({
            where: {
                id: friendRequestId
            },
            select: {
                id: true,
                user1: {
                    select: {
                        id: true,
                        login: true,
                        avatar: true
                    }
                },
                user2: {
                    select: {
                        id: true,
                        login: true,
                        avatar: true
                    }
                },
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
    }
    async declineFriendRequest(friendRequestId) {
        await this.prisma.friend.delete({
            where: {
                id: friendRequestId
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
    }
    async getFriends(userId) {
        const friendTab = await this.prisma.friend.findMany({
            where: {
                OR: [
                    {
                        user1Id: userId,
                        status: 'accepted'
                    },
                    {
                        user2Id: userId,
                        status: 'accepted'
                    }
                ]
            },
            include: {
                user1: true,
                user2: true
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
        const relationFriendTab = friendTab.map((elem) => {
            if (userId === elem.user1Id) {
                return {
                    id: elem.user2Id,
                    login: elem.user2.login,
                    avatar: elem.user2.avatar
                };
            }
            else {
                return {
                    id: elem.user1Id,
                    login: elem.user1.login,
                    avatar: elem.user1.avatar
                };
            }
        });
        console.log(relationFriendTab);
        return relationFriendTab;
    }
    async getFriendRequests(userId) {
        console.log('userId: ', userId);
        const friendRequestsTab = await this.prisma.friend.findMany({
            where: {
                OR: [
                    {
                        user1Id: userId,
                        status: 'pending'
                    },
                    {
                        user2Id: userId,
                        status: 'pending'
                    }
                ]
            },
            include: {
                user1: true,
                user2: true
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
        const relationFriendRequestsTab = friendRequestsTab.map((elem) => {
            return {
                id: elem.id,
                user1Login: elem.user1.login,
                user1Id: elem.user1Id,
                user2Login: elem.user2.login,
                user2Id: elem.user2Id,
                status: elem.status,
                createdAt: elem.createdAt,
            };
        });
        console.log('relationFriendRequests: ', relationFriendRequestsTab);
        return relationFriendRequestsTab;
    }
    async createFriendRequest(friendRequestData) {
        const isExisting = await this.isExisting({ user1_id: friendRequestData.user2_id, user2_id: friendRequestData.user1_id });
        if (isExisting)
            return isExisting;
        const newFriendRequest = await this.prisma.friend.create({
            data: {
                user1Id: friendRequestData.user1_id,
                user2Id: friendRequestData.user2_id
            },
            include: {
                user1: true,
                user2: true
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
        return {
            id: newFriendRequest.id,
            user1Login: newFriendRequest.user1.login,
            user1Id: newFriendRequest.user1Id,
            user2Login: newFriendRequest.user2.login,
            user2Id: newFriendRequest.user2Id,
            status: newFriendRequest.status,
            createdAt: newFriendRequest.createdAt,
        };
    }
    async isExisting(friendRequestData) {
        const friendRequest = await this.prisma.friend.findMany({
            where: {
                user1Id: friendRequestData.user1_id,
                user2Id: friendRequestData.user2_id
            }
        });
        console.log('isExistrong : ', friendRequest);
        if (friendRequest.length !== 0)
            return true;
        return false;
    }
};
FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FriendsService);
exports.FriendsService = FriendsService;
//# sourceMappingURL=friends.service.js.map