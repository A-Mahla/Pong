import { INestApplication, INestApplicationContext, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { RoomsService } from './chat/rooms/rooms.service';
import { PrismaService } from './prisma/prisma.service';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';
import { SocketIOAdapter } from './adapter/socket-io.adapter';
import { HttpAdapterHost } from '@nestjs/core';
import { TwofaModule } from './twofa/twofa.module';

@Module({
  imports: [UsersModule, AuthModule, JwtModule, ChatModule, GameModule, TwofaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, RoomsService, ChatGateway, GameService],
})
export class AppModule {}
