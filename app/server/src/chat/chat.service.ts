import { Injectable } from "@nestjs/common";
import { Room, User } from "@prisma/client";
import { ServerStreamFileResponseOptions } from "http2";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/users.service";
import { CreateRoomData, MessageData, LeaveRoomData, JoinRoomData, AddFriendData, FriendRequestData } from "./Chat.types";
import { MessageService } from "./messages/messages.service";
import { RoomsService } from "./rooms/rooms.service";
import { FriendsService } from "./friends/friends.service";

@Injectable()
export class ChatService {
	constructor(private readonly roomService: RoomsService,
		private readonly userService: UsersService,
		private readonly messageService: MessageService,
		private readonly friendService: FriendsService) { }

	async createRoom(server: Server, client: Socket, payload: CreateRoomData) {
		console.log('payload in CREATE ROOM: ', payload);

		const newRoom = await this.roomService.createRoom(payload);

		client.join((newRoom as Room).room_id.toString() + payload.name)

		server.to(client.id).emit('roomCreated', { name: payload.name, room_id: newRoom?.room_id, messages: [] })

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

		server.to(client.id).emit('roomJoined', room)

		return this.userService.joinRoom(payload.user_id, payload.room_id)
	}

	async sendFriendRequest(server: Server, client: Socket, payload: FriendRequestData) {

		const existingRequest = await this.friendService.isExisting({user1_id: payload.user2_id, user2_id: payload.user1_id})

		if (existingRequest === true)
			return 'the receiver already send you a friend request'

		const newFriendRequest = await this.friendService.createFriendRequest(payload)

		console.log('dans sendFriendRequest\n\n\n\n\n\n\n\n\n\nn\n\n\n\n\n\n\n')

		server.to(payload.user2_id.toString()).to(client.id).emit('friendRequest', newFriendRequest)

		return newFriendRequest
	}

	async acceptFriendRequest(server: Server, client: Socket,
			friendRequestId: number) {
		
		const friendAcceptedRelation = await this.friendService.acceptFriendRequest(friendRequestId)
		if (friendAcceptedRelation === null)
			return

		console.log('friendAcceptedRelation: ', friendAcceptedRelation)
	
		server.to(friendAcceptedRelation.user1.id.toString()).emit('newFriend', friendAcceptedRelation.user2)
		server.to(friendAcceptedRelation.user2.id.toString()).emit('newFriend', friendAcceptedRelation.user1)

		return friendAcceptedRelation
	}

	async declineFriendRequest(server: Server, client: Socket, payload: {senderId: number, friendRequestId: number}) {
		await this.friendService.declineFriendRequest(payload.friendRequestId)
		server.to(payload.senderId.toString()).emit('declineFriend', payload.friendRequestId)
	}

}