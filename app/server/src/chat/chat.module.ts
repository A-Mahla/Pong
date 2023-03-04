import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { RoomsController } from "./rooms/rooms.controller";
import { RoomsService } from "./rooms/rooms.service";
import { UsersService } from "src/users/users.service";
import { GameService } from "src/game/game.service";
import { ChatGateway } from "./chat.gateway";

@Module({
	imports: [PrismaModule],
	controllers: [RoomsController],
	providers: [UsersService, RoomsService, GameService]
})
export class ChatModule {}

