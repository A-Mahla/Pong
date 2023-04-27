import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { StatusService } from './status.service';
import { jwtConstants } from 'src/auth/constants';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ namespace: 'status' })
export class StatusGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private readonly statusService: StatusService
	) { }

	@WebSocketServer()
	server: Server;

	afterInit(server: Server): any {
		console.log('Initialized status')
	}

	@SubscribeMessage('inGame')
	handleInGame(client: Socket, userId: number) {
		this.statusService.inGame(userId)
	}

	@SubscribeMessage('outGame')
	handleOutGame(client: Socket, userId: number) {
		this.statusService.connectUser(userId)
	}

	handleConnection(client: Socket, ...args: any[]): any {
		if (client.handshake.auth.token && jwtConstants.jwt_secret) {
			try {
				const clientPayload = jwt.verify(client.handshake.auth.token, jwtConstants.jwt_secret);

				console.log('clientPayload: ', clientPayload)
				console.log(`Client connected on Status Socket: \n\n\n\n\n\n${client.id}`);
				this.server.to(client.id).emit('connected')

				if (clientPayload && clientPayload.sub)
					this.statusService.connectUser(+(clientPayload.sub))

			} catch (err) {
				client.disconnect(true);
			}
		}
	}

	handleDisconnect(client: Socket): any {
		if (client.handshake.auth.token && jwtConstants.jwt_secret) {
			try {
				const clientPayload = jwt.verify(client.handshake.auth.token, jwtConstants.jwt_secret);
				if (clientPayload && clientPayload.sub) {

					this.statusService.disconnectUser(+(clientPayload.sub))
				}
				console.log(`Client disconnected from Status Socket: ${client.id}`);
			} catch (err) {
				client.disconnect(true);
			}

		}

	}
}
