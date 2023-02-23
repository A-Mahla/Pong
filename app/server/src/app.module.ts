import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { RoomsService } from './chat/rooms/rooms.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [UsersModule, AuthModule, JwtModule, ChatModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, RoomsService, ChatGateway],
})
export class AppModule {}
