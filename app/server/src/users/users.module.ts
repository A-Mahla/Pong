import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module'
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { GameService } from "src/game/game.service";
import { RoomsService } from 'src/chat/rooms/rooms.service';

@Module({
	imports: [PrismaModule, forwardRef(() => AuthModule)],
	controllers: [UsersController],
	providers: [UsersService, RoomsService, JwtService, GameService],
	exports: [UsersService]
})
export class UsersModule {}

