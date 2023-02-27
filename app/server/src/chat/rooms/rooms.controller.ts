import { Controller } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { Get } from "@nestjs/common"

@Controller('rooms')
export class RoomsController {
	constructor(private readonly roomService: RoomsService) {}

	@Get()
	getAllRooms() {
		return this.roomService.findAll()
	}
}