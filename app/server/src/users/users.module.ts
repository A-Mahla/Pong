import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module'
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
	imports: [PrismaModule, forwardRef(() => AuthModule)],
	controllers: [UsersController],
	providers: [UsersService, JwtService],
	exports: [UsersService]
})
export class UsersModule {}

