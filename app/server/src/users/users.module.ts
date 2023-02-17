import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module'
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
	imports: [PrismaModule],
	controllers: [UsersController],
	providers: [UsersService, AuthService, JwtService],
	exports: [UsersService]
})
export class UsersModule {}

