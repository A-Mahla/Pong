import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors : {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  transports: ['websocket', 'polling'],
  }})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('client: ',client)
    console.log('payload: ',payload)
    return 'Hello world!';
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
