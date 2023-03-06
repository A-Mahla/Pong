import { Injectable, BadRequestException} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Room, User, User_Room } from "@prisma/client"
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

		const newRoomData = {
			createdAt: new Date(),
			name: roomDetails.roomName,
			ownerId: roomOwner.id,
			//members: {
			//	connect: [{ member_id : roomOwner.id}]
			//}
		}

		console.log('newRoomData: ', newRoomData)
		const newRoom = await this.prisma.room.create({
			data: {...newRoomData}
		}).catch((e: any) => {throw e});

		const memberRoom = await this.prisma.user_Room.create({
			data: {
				member_id : roomOwner.id,
				room_id : newRoom.room_id
			}
		}).catch((e) => {throw new BadRequestException(e)})

		return newRoom 
	}

	async findAll () {
		return this.prisma.room.findMany({
			include: {
				members: true
			}
		})
	}

	async getRoomById (roomId: number) {
		const id = +roomId;
		return this.prisma.room.findUnique(
			{
				where: {
					room_id : id
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

		const user = await this.userService.findUserById((room as Room).ownerId as number)
		console.log(user)
		//return (user as User).ownedRooms
		return user
	}

	async findManyRooms (name : string) {
		const rooms = await this.prisma.room.findMany({
			where: {
				name : name
			}
		})
		return rooms
	}
}