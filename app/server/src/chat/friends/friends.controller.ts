import { Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendsService } from "./friends.service";

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendService: FriendsService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async handleGetFriends(@Request() req: any) {
		return await this.friendService.getFriends(req.user.sub)
	}

	@UseGuards(JwtAuthGuard)
	@Get('requests')
	async getFriendsRequests(
		@Request() req: any
	) {
		return await this.friendService.getFriendRequests(req.user.sub)
	}

	@UseGuards(JwtAuthGuard)
	@Post(':id')
	async sendFriendRequest(
		@Request() req: any,
		@Param('id') friendLogin: number
	) {
		return await this.friendService.createFriendRequest({user1_id: req.user.sub, user2_id: friendLogin})
	}
}