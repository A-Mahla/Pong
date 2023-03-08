import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { RoomsService } from "../rooms/rooms.service";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class MessageService {
	constructor (private prisma: PrismaService,
		private userService: UsersService,
		private roomService: RoomsService) {}

	async createMessage(senderId: number, roomId: number, content: string) {
		console.log('createMessage datas: ', senderId, roomId, content);
		

		return await this.prisma.message.create({
			data: {
				sender_id:senderId,
				room_id: roomId, 
				content: content
			} 
		}).catch((e) => {
			throw new BadRequestException(e);
		})
	}	

	async getRoomMessages(roomId: number) {
		return await this.prisma.message.findMany({
			where: {
				room_id : roomId
			}
		}).catch((e) => {
			throw new BadRequestException(e);
		})

	}

}