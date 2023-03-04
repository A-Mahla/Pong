import { Controller, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from './rooms/rooms.service';
import { WsGuard } from './ws.guard';

type MessageData = {
	content: string,
	sender: string,
  time?: string,
  room?: string
}

type CreateRoomData = {
  roomName: string;
  ownerName: string,
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private readonly roomService: RoomsService, private readonly userService : UsersService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: MessageData)/* : MessageData */ {
    console.log('payload: ',payload)
    if (payload.room)
    {
      console.log('client rooms in handle MESSAGE', client.rooms)
      this.server.to(payload.room).emit('message', payload)
      console.log('payload in message handler', payload)

    }
    else
      this.server.emit('message', payload)
    //return payload;
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: any, payload: CreateRoomData) {
    
    console.log('payload: ', payload);
    
    client.join(payload.roomName)
    //client.emit('roomCreated', payload.roomName)
    
    return this.roomService.createRoom(payload) 
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, login: string) {
    const user = await this.userService.findOneUser(login)

    const rooms = await this.userService.findAllUserRooms((user as User).login)

    console.log('client rooms in handle JOIN', client.rooms)

    for (let room of rooms)
    {
      client.join(room.name)
      console.log(room.name)
    }
    console.log('rooms: ', rooms)
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client : Socket, payload : {userLogin : string, room : string, password : string})
  {
    //this.userService.addRoom(login, room)
    
  }
    

  afterInit(server : Server): any {
    console.log('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]): any {
    client.disconnect();
    console.log('args: ', args)
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected: ${client.id}`);
  }
}
