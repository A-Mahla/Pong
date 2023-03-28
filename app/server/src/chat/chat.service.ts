import { Injectable } from "@nestjs/common";
import { Room, User } from "@prisma/client";
import { ServerStreamFileResponseOptions } from "http2";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/users.service";
import { CreateRoomData, MessageData, LeaveRoomData, JoinRoomData, AddFriendData } from "./Chat.types";
import { MessageService } from "./messages/messages.service";
import { RoomsService } from "./rooms/rooms.service";

@Injectable()
export class ChatService {
	constructor(private readonly roomService: RoomsService,
		private readonly userService: UsersService,
		private readonly messageService: MessageService) { }

	async createRoom(server: Server, client: Socket, payload: CreateRoomData) {
		console.log('payload in CREATE ROOM: ', payload);

		const newRoom = await this.roomService.createRoom(payload);

		client.join((newRoom as Room).room_id.toString() + payload.name)

		server.to(client.id).emit('roomCreated', { name: payload.name, id: newRoom?.room_id, messages: [] })

		return newRoom
	}

	async manageDirectMessage(server: Server, client: Socket, payload: MessageData) {

		if (payload.recipient_id !== undefined) {
			console.log('payload in create direct message: ', payload)
			const newDirectMessage = await this.messageService.createDirectMessage(payload.sender_id, payload.recipient_id, payload.content)
			server.to(payload.recipient_id.toString()).emit('directMessage', newDirectMessage)
			server.to(client.id).emit('directMessage', newDirectMessage)
			console.log('payload direct message: ', payload)
			console.log('newDirectMessage: ', newDirectMessage)
		}
	}

	async manageRoomMessage(server: Server, client: Socket, payload: MessageData) {

		console.log("payload:\n\n", payload);


		if (payload.room !== undefined) {
			console.log('client rooms in handle MESSAGE', client.rooms)
			const newMessage = await this.messageService.createMessage(payload.sender_id, payload.room.id, payload.content)
			server.to(payload.room.id.toString() + payload.room.name).emit('roomMessage', newMessage)
			//client.to(payload.room.id.toString() + payload.room.name).emit('roomMessage', newMessage)
			console.log('payload in message handler', payload)
		}

		return payload
	}

	async leaveRoom(server: Server, client: Socket, payload: LeaveRoomData) {

		//client.leave(payload.room_id.toString() + payload.room_name)

		const message: MessageData = {
			content: `${payload.user_login} leaved the room`,
			sender_id: payload.user_id,
			room: {
				name: payload.room_name,
				id: payload.room_id,
			}
		}

		console.log('leaveRoom payload: \n\n\n\n', payload, message)

		const newMessage = await this.messageService.createMessage(payload.user_id, payload.room_id, `${payload.user_login} leaved the room`)

		//server.to(payload.room_id.toString() + payload.room_name).emit('message', newMessage)
		server.to(client.id).emit('roomLeaved', { room_id: payload.room_id, room_name: payload.room_name })

		return this.roomService.deleteRelation(payload.user_id, payload.room_id)
	}

	async join(client: Socket, userId: number) {

		const rooms = await this.userService.findAllUserRooms(userId)

		//join his direct message room
		client.join(userId.toString())

		console.log('client rooms in handle JOIN', client.rooms)

		for (let room of rooms) {
			client.join(room.room_id.toString() + room.name)
			console.log(room.room_id.toString() + room.name)
		}
		console.log('rooms: ', rooms)

	}

	async joinRoom(server: Server, client: Socket, payload: JoinRoomData) {

		client.join(payload.room_id.toString() + payload.room_name)

		const room = await this.roomService.getRoomById(payload.room_id)

		console.log('room in JOIN: ', room)

		//server.to(client.id).emit('roomJoined', {name: payload.room_name, id: payload.room_id})
		//console.log('JOIN ROOM \n\n\n\n\n\n', {id: (room as Room).room_id, name: (room as Room).name, messages: (room as Room).messages})
		server.to(client.id).emit('roomJoined', room)

		return this.userService.joinRoom(payload.user_id, payload.room_id)
	}

	async addFriend(server: Server, client: Socket, payload: AddFriendData) {
		return this.userService.addFriend(payload)
	}
}