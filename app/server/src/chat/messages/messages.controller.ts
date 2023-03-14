import { Controller, Get, Param, UseGuards} from "@nestjs/common"
import { UsersService } from "src/users/users.service";
import { MessageService } from "./messages.service";

@Controller('messages')
export class MessageController {
	constructor (private readonly messageService: MessageService, 
		private readonly userService: UsersService) {}

	@Get('room/:id')
	getRoomMessages(
		@Param('id') roomId: number
	) {
		return this.messageService.getRoomMessages(roomId)
	}

	@Get('direct/:login')
	getDirectMessages(
		@Param('login') recipientLogin: string
	) {

		//return this.messageService.getUserDirectMessages()

		return this.messageService.getUserDirectMessagesLogin(recipientLogin)

	}
}