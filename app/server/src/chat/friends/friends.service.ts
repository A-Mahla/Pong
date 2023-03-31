import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddFriendData, FriendRequestData } from "../Chat.types";

@Injectable()
export class FriendsService {

	constructor(private readonly prisma: PrismaService) {}

	async acceptFriend(payload: AddFriendData) {
		return await this.prisma.friend.updateMany({
			where: {
				OR: [
					{
						user1Id: payload.user1_id,
						user2Id: payload.user2_id
					},
					{
						user1Id: payload.user2_id,
						user2Id: payload.user1_id
					}
				]
			},
			data: {
				status: 'accepted'
			}
		}).catch((e) => {
			throw new BadRequestException(e);
		})

	}

	async getFriends(userId: number) {
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
			throw new BadRequestException(e);
		})


		const relationFriendTab = friendTab.map((elem) => {
			return {
				id: elem.id,
				user1Login: elem.user1.login,
				user1Id: elem.user1Id,
				user2Login: elem.user2.login,
				user2Id: elem.user2Id,
				status: elem.status,
				createdAt: elem.createdAt,

			}
		})

		console.log(relationFriendTab)

		return relationFriendTab
	}

	async getFriendRequests(userId: number) {
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
			throw new BadRequestException(e);
		})


		const relationFriendRequestsTab = friendRequestsTab.map((elem) => {
			return {
				id: elem.id,
				user1Login: elem.user1.login,
				user1Id: elem.user1Id,
				user2Login: elem.user2.login,
				user2Id: elem.user2Id,
				status: elem.status,
				createdAt: elem.createdAt,
			}
		})

		console.log(relationFriendRequestsTab)

		return relationFriendRequestsTab
	}

	async createFriendRequest(friendRequestData: FriendRequestData) {
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
			throw new BadRequestException(e);
		})

			return {
				id: newFriendRequest.id,
				user1Login: newFriendRequest.user1.login,
				user1Id: newFriendRequest.user1Id,
				user2Login: newFriendRequest.user2.login,
				user2Id: newFriendRequest.user2Id,
				status: newFriendRequest.status,
				createdAt: newFriendRequest.createdAt,
			}
	}  
}