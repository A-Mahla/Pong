import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, AuthModule, JwtModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
