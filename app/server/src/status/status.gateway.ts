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
		this.statusService.inGame(this.server, userId)
	}

	@SubscribeMessage('outGame')
	handleOutGame(client: Socket, userId: number) {
		this.statusService.connectUser(this.server, userId)
	}

	handleConnection(client: Socket, ...args: any[]): any {
		if (client.handshake.auth.token && jwtConstants.jwt_secret) {
			try {
				const clientPayload = jwt.verify(client.handshake.auth.token, jwtConstants.jwt_secret);

				this.server.to(client.id).emit('connected')

				if (clientPayload && clientPayload.sub) {
					this.statusService.connectUser(this.server, +(clientPayload.sub))
					client.join(clientPayload.sub.toString() + 'chat')
				}


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

					this.statusService.disconnectUser(this.server, +(clientPayload.sub))
					client.leave(clientPayload.sub.toString() + 'chat')
				}

			} catch (err) {
				console.log('socket deconnected')
			}

		}

	}
}