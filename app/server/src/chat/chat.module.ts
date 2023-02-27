import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { RoomsController } from "./rooms/rooms.controller";
import { RoomsService } from "./rooms/rooms.service";
import { UsersService } from "src/users/users.service";

@Module({
	imports: [PrismaModule],
	controllers: [RoomsController],
	providers: [UsersService, RoomsService] 
})
export class ChatModule {}