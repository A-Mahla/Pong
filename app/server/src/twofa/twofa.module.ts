import { Module } from '@nestjs/common';
import { TwoFAService } from './twofa.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TwofaController } from './twofa.controller';
import { GameService } from 'src/game/game.service';

@Module({
  controllers: [TwofaController],
  providers: [
	  TwoFAService,
	  UsersService,
	  PrismaService,
	  GameService,
  ]
})
export class TwofaModule {}
