import { Injectable } from "@nestjs/common";
import { Room, User } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/users.service";
import { CreateRoomData, MessageData } from "./Chat.types";
import { MessageService } from "./messages/messages.service";
import { RoomsService } from "./rooms/rooms.service";

@Injectable()
export class ChatService {
	constructor(private readonly roomService: RoomsService,
		private readonly userService: UsersService,
		private readonly messageService: MessageService) {}

		async createRoom(server: Server, client: Socket, payload: CreateRoomData) {
			console.log('payload in CREATE ROOM: ', payload);

			const newRoom = await this.roomService.createRoom(payload);

			client.join((newRoom as Room).room_id.toString() + payload.roomName)

			console.log('clientId: ', client.id)

			server.to(client.id).emit('roomCreated', {name: payload.roomName, id: newRoom?.room_id})
	
			return newRoom 
		}

		async manageMessage(server: Server, client: Socket, payload: MessageData) {
			
			const user = await this.userService.findOneUser(payload.sender)
			if (payload.room)
			{
				console.log('client rooms in handle MESSAGE', client.rooms)
				const newMessage = await this.messageService.createMessage((user as User).id, payload.room.id, payload.content) 
				server.to(payload.room.id.toString() + payload.room.name).emit('message', newMessage)
				console.log('payload in message handler', payload)
			}
			else
				server.emit('message', payload)
		}  

		async leaveRoom(server: Server, client: Socket, payload: {user: string, roomId: number}) {

			client.leave(payload.roomId.toString())
			client.to(payload.roomId.toString()).emit('message', `${payload.user} leaved the room`)
			server.to(client.id).emit('roomLeaved', payload.roomId)

			return this.roomService.deleteRelation(payload.user, payload.roomId)
		}
}