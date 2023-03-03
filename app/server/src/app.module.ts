import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { AuthMiddleware } from './chat/chat.middleware';

@Module({
  imports: [UsersModule, AuthModule, JwtModule, ChatModule, GameModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, RoomsService, ChatGateway, GameService],
})
export class AppModule {} /* implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'chat', method: RequestMethod.ALL})
  }
} */
