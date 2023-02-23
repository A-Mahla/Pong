import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Room } from "@prisma/client"
import { CreateRoomParam } from "../Chat.types";

@Injectable()
export class RoomsService {

	constructor(private prisma: PrismaService) {}

	async createRoom (roomDetails: CreateRoomParam) : Promise<Room> {
		const newRoom = {
			createdAt: new Date(),
			...roomDetails,
		}
		
		return this.prisma.room.create({
			data: {...newRoom}
		}).catch((e) => {throw e});
	}

	async findAll () {
		return this.prisma.room.findMany()
	}
}