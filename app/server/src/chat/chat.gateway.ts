import { Controller, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from './rooms/rooms.service';
import { CreateRoomData } from './Chat.types';
import { WsGuard } from './ws.guard';
import { MessageService } from './messages/messages.service';

type MessageData = {
	content: string,
	sender: string,
  time?: string,
  room?: {
    name: string,
    id: number
  }
}

@WebSocketGateway({namespace : 'chat'})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private readonly roomService: RoomsService,
    private readonly userService : UsersService,
    private readonly messageService: MessageService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: MessageData)/* : MessageData */ {
    console.log('payload: ',payload)
    const user = await this.userService.findOneUser(payload.sender)
    if (payload.room)
    {
      console.log('client rooms in handle MESSAGE', client.rooms)
      this.server.to(payload.room.id.toString()).emit('message', {sender: (user as User).id, content: payload.content, room: payload.room})
      console.log('payload in message handler', payload)
      this.messageService.createMessage((user as User).id, payload.room.id, payload.content) 
    }
    else
      this.server.emit('message', payload)
    //return payload;
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: any, payload: CreateRoomData) {
    
    console.log('payload: \n\n\n\n\n\n\n\n\n\n\n\n\n', payload);
    client.join(payload.roomName)
    //client.emit('roomCreated', payload.roomName)
    
    return this.roomService.createRoom(payload)
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: any, payload: {user: string, roomId: number}) {

    client.leave(payload.roomId.toString())
    client.to(payload.roomId.toString()).emit('message', `${payload.user} leaved the room`)

    return this.roomService.deleteRelation(payload.user, payload.roomId)
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, login: string) {
    const user = await this.userService.findOneUser(login)

    const rooms = await this.userService.findAllUserRooms((user as User).id)

    console.log('client rooms in handle JOIN', client.rooms)

    for (let room of rooms)
    {
      client.join(room.room_id.toString())
      console.log(room.room_id)
    }
    console.log('rooms: ', rooms)
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client : Socket, payload : {userLogin : string, roomId : number})
  {
    const user = await this.userService.findOneUser(payload.userLogin)

    console.log('handle JOIN ROOM payload : ', payload)

    client.join(payload.roomId.toString())

    return this.userService.joinRoom((user as User).id, payload.roomId)
  }
    
  afterInit(server : Server): any {
    console.log('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log('args: ', args)
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected: ${client.id}`);
  }
}
