import { User } from "@prisma/client"
import { CreateUserParams } from "src/users/User.types";

export type CreateRoomData = {
  roomName: string;
  roomPassword?: string,
  roomOwner: string,
}