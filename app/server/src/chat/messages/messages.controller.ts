import { Controller, Get, Param} from "@nestjs/common"
import { MessageService } from "./messages.service";

@Controller('messages')
export class MessageController {
	constructor (private readonly messageService: MessageService) {}

	@Get('room/:id')
	getRoomMessages(
		@Param('id') roomId: number
	) {
		return this.messageService.getRoomMessages(roomId)
	}
}