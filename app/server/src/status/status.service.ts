import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StatusService {
	constructor(
		private readonly userService: UsersService
	) {}

	async connectUser(userId: number) {
		return await this.userService.connect(userId)
	}

	async disconnectUser(userId: number) {
		return await this.userService.disconnect(userId)
	}

	async inGame(userId: number) {
		return await this.userService.inGame(userId)
	}
}