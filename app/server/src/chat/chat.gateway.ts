import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { RoomsService } from './rooms/rooms.service';

type MessageData = {
	content: string,
	sender: string,
  time?: string,
}

type CreateRoomData = {
  roomName: string;
  ownerName: string,
}

@WebSocketGateway(
 // {cors : {
 //   origin: "http://localhost:3000",
 //   methods: ["GET", "POST"],
 //   transports: ['websocket', 'polling'],
 //   }
 // }
  )
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private readonly roomService: RoomsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: MessageData): MessageData {
    console.log('client: ',client)
    console.log('payload: ',payload)
    this.server.emit('message', payload)
    return payload;
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: any, payload: CreateRoomData) {
    client.join(payload.roomName)
    client.emit('roomCreated', payload.roomName)
    console.log('payload: ', payload);
    
    return this.roomService.createRoom(payload) 
  }

  @SubscribeMessage('messageToRoom')
  handleMessageToRoom(client: any, message: {content: string, sender: string, room: string}) {
    console.log('message: ', message)
    //console.log('client: ', client)
    return client.in(`/${message.room}`).emit('messageToRoom', message.content)
  }

  afterInit(server : Server): any {
    console.log('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected: ${client.id}`);
  }
}
