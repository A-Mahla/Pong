import { Controller, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { RoomsService } from './rooms/rooms.service';
import { CreateRoomData, JoinRoomData, MessageData } from './Chat.types';
import { WsGuard } from './ws.guard';
import { MessageService } from './messages/messages.service';
import { ChatService } from './chat.service';
import { LeaveRoomData } from './Chat.types';

@WebSocketGateway({namespace : 'chat'})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  constructor (private readonly roomService: RoomsService,
    private readonly userService : UsersService,
    private readonly messageService: MessageService,
    private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('directMessage')
  async handleDirectMessage(client: any, payload: MessageData)/* : MessageData */ {
    console.log('payload: ', payload)
    return await this.chatService.manageDirectMessage(this.server, client, payload)
  }

  @SubscribeMessage('roomMessage')
  async handleRoomMessage(client: any, payload: MessageData)/* : MessageData */ {
    console.log('payload: ', payload)
    return await this.chatService.manageRoomMessage(this.server, client, payload)
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(client: any, payload: CreateRoomData) {
    return this.chatService.createRoom(this.server, client, payload)  
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: any, payload: LeaveRoomData) {
    return await this.chatService.leaveRoom(this.server, client, payload)
  }

  @SubscribeMessage('join')
  async handleJoin(client: Socket, id: number) {
    return this.chatService.join(client, id)
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client : Socket, payload : JoinRoomData) {
    return this.chatService.joinRoom(this.server, client, payload)
  }
    
  afterInit(server : Server): any {
    console.log('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log('args: ', args)
    console.log(`Client connected: ${client.id}`);
    this.server.to(client.id).emit('connected')
  }

  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected: ${client.id}`);
  }
}