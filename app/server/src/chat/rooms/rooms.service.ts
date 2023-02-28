import { Injectable, BadRequestException} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Room } from "@prisma/client"
import { CreateRoomParam } from "../Chat.types";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RoomsService {

	constructor(private prisma: PrismaService, 
		private userService: UsersService) {}

	async createRoom (roomDetails: CreateRoomParam) : Promise<Room | null> {

    	const roomOwner = await this.userService.findOneUser(roomDetails.ownerName)
		console.log("roomOwner: ", roomOwner)

		if (!roomOwner)
			return null 

		const newRoom = {
			createdAt: new Date(),
			name: roomDetails.roomName,
			ownerId: roomOwner.id
		}

		console.log('newRoom: ', newRoom)
		
		return this.prisma.room.create({
			data: {...newRoom}
		}).catch((e: any) => {throw e});
	}

	async findAll () {
		return this.prisma.room.findMany()
	}

	async getRoomById (roomId: number) {
		const id = +roomId;
		return this.prisma.room.findUnique(
			{
				where: {
					id : id
				}
			}
		)
	}

	async getRoomOwner (roomId: number) {
		const room = await this.getRoomById(roomId)
		console.log(room)
		if (room === null)
			throw new BadRequestException('Invalid content', { cause: new Error(), description: 'invalid room id' })  
		if (room.ownerId === null)
			throw new BadRequestException('Invalid content', { cause: new Error(), description: 'room dont have owner' })  

		return this.userService.findUserById((room as Room).ownerId as number)
	}
}