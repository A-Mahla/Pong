import { Injectable, NestMiddleware } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

	use(socket: Socket, next: () => void) {

		const handshakeHeaders = socket.handshake.headers

		console.log('socket handshake headers', handshakeHeaders )

		next()
	}
}