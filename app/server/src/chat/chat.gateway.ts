import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

type MessageData = {
	content: string,
	sender: string,
  time?: string,
}

@WebSocketGateway({cors : {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  transports: ['websocket', 'polling'],
  }})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

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
  handleCreateRoom(client: any, roomName: string) {
    client.join(roomName)
    client.emit('roomCreated', roomName)

  }

  @SubscribeMessage('messageToRoom')
  handleMessageToRoom(client: any, message: {content: string, sender: string, room: string}) {
    this.server.to(message.room).emit(message.content)
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
