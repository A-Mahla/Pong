import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { RoomsController } from "./rooms/rooms.controller";
import { RoomsService } from "./rooms/rooms.service";

@Module({
	imports: [PrismaModule],
	controllers: [RoomsController],
	providers: [RoomsService] 
})
export class ChatModule {}