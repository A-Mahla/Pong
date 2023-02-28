import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from "src/prisma/prisma.module";
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [GameService, JwtService],
  controllers: [GameController],
  exports: [GameService]
})
export class GameModule {}
