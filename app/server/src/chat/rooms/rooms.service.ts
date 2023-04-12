import { Injectable, BadRequestException} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Room, User, User_Room } from "@prisma/client"
import { CreateRoomData } from "../Chat.types";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RoomsService {

	constructor(private prisma: PrismaService, 
		private userService: UsersService) {}

	async createRoom (roomDetails: CreateRoomData) : Promise<Room | null> {

		const newRoomData = {
			name: roomDetails.name,
			ownerId: roomDetails.owner_id,
			password: roomDetails.password 
		}

		console.log('newRoomData: ', newRoomData)
		const newRoom = await this.prisma.room.create({
			data: {...newRoomData}
		}).catch((e: any) => {throw e});

		/* const memberRoom =  */await this.prisma.user_Room.create({
			data: {
				member_id : roomDetails.owner_id,
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
		}).catch((e) => {
			throw new BadRequestException(e);
		})

	}

	async getRoomById (roomId: number) {
		const id = +roomId;
		return this.prisma.room.findUnique(
			{
				where: {
					room_id : id
				},
				select: {
					messages: true,
					ownerId: true,
					isPublic: true
				},
			}
		).catch((e) => {
			throw new BadRequestException(e);
		})

	}

	async getRoomOwner (roomId: number) {
		const room = await this.getRoomById(roomId)
		console.log(room)
		if (room === null)
			throw new BadRequestException('Invalid content', { cause: new Error(), description: 'invalid room id' })  
		if (room.ownerId === null)
			throw new BadRequestException('Invalid content', { cause: new Error(), description: 'room dont have owner' })  

		const user = await this.userService.findUserById(room.ownerId as number)
		.catch((e) => {
			throw new BadRequestException(e);
		})

		console.log(user)
		//return (user as User).ownedRooms
		return user
	}

	async findManyRooms (name : string) {
		const rooms = await this.prisma.room.findMany({
			where: {
				name : name
			},
		}).catch((e) => {
			throw new BadRequestException(e);
		})

		return rooms
	}

	async findMatchingRooms (name : string) {
		const rooms = await this.prisma.room.findMany({
			where: {
				name : {
					contains: name
				}
			}
		}).catch((e) => {
			throw new BadRequestException(e);
		})

		console.log(rooms)

		return rooms
	}

	async deleteRelation(userId: number, roomId: number) {
		return this.prisma.user_Room.delete({
			where : {
				member_id_room_id: {
					member_id : userId,
					room_id : roomId
				}
			}
		}).catch((e) => {
			throw new BadRequestException(e);
		})
	}
	
}