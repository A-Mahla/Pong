import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { FriendsService } from "./friends.service";

@Controller('friends')
export class FriendsController {
	constructor(private readonly friendService: FriendsService) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getFriendsRequests(
		@Request() req: any
	) {
		return await this.friendService.getFriendRequests(req.user.id)
	}
}