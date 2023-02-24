import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Room } from "@prisma/client"
import { CreateRoomParam } from "../Chat.types";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RoomsService {

	constructor(private prisma: PrismaService, 
		private userService: UsersService) {}

	async createRoom (roomDetails: CreateRoomParam) : Promise<Room> {

    	const roomOwner = await this.userService.findOneUser(roomDetails.ownerName)
		console.log("roomOwner: ", roomOwner)

		if (!roomOwner)
			return 

		const newRoom = {
			createdAt: new Date(),
			name: roomDetails.roomName,
			owner: roomOwner	
		}

		//const newRoom = {
		//	createdAt: new Date(),
		//	...roomDetails,
		//}
		
		return this.prisma.room.create({
			data: {...newRoom}
		}).catch((e) => {throw e});
	}

	async findAll () {
		return this.prisma.room.findMany()
	}
}