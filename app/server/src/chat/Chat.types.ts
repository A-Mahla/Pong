import { User } from "@prisma/client"
import { CreateUserParams } from "src/users/User.types";

export class CreateRoomParam {
	password?: string;
	roomName: string;
	ownerName: string
} 