import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { RoomsService } from "../rooms/rooms.service";
import { BadRequestException } from "@nestjs/common";
import { User } from "@prisma/client";

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
				content: content,
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

	async createDirectMessage(senderId: number, recipientId: number, content: string) {
		console.log('in create message: ', senderId, recipientId, content)

		return await this.prisma.direct_Message.create({
			data: {
				sender_id : senderId,
				recipient_id: recipientId,
				content: content
			}
		}).catch((e) => {
			throw new BadRequestException(e);
		})

	}

	async getUserDirectMessages(userId: number) {
		return await this.prisma.direct_Message.findMany({
			where: {
				recipient_id: userId
			}
		}).catch((e) => {
			throw new BadRequestException(e);
		})

	}

	async getUserDirectMessagesLogin(userLogin: string) { //TODO supprimer cette merde pour travailler que avec des ID svp
		
		const recipient = await this.userService.findOneUser(userLogin)

		return await this.prisma.direct_Message.findMany({
			where: {
				recipient_id: (recipient as User).id
			}
		}).catch((e) => {
			throw new BadRequestException(e);
		})

	}
 
}