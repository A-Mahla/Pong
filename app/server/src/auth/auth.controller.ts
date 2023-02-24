import { Controller,
	Get,
	Post,
	Body,
	Request,
	Put,
	Delete,
	Patch,
	Param,
	Res,
	UseInterceptors,
	NestInterceptor,
	UploadedFile,
	Query,
	HttpException,
	StreamableFile,
	BadGatewayException,
	BadRequestException,
	Inject,
	Injectable,
	UseGuards,
	ConsoleLogger,
	Req,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/users/User.dto'
import { UsersService } from 'src/users/users.service'
import { Response } from "express";
import { Request as ExpressRequest } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service'
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RefreshJwtAuthGuard } from 'src/auth/refresh-jwt-auth.guard'


@Controller('auth')
export class AuthController {

	constructor(private userService: UsersService,
		private authService: AuthService) {
	}
	/* -------------- basic authentication routes ---------------- */

	@Post('signup')
	async createUser(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true }) response: Response
	) {
		return this.authService.login(
			await this.userService.createUser(createUserDto),
			response
		);
	}

	@UseGuards(LocalAuthGuard)
	@Post('signin')
	async login(
		@Request() req: any,
		@Res({ passthrough: true }) response: Response
	) {
		return await this.authService.login(req.user, response);
	}

	@Post('logout')
  	async logout(@Request() req: any) {
		return this.authService.logout(req.user);
	}

	@UseGuards(RefreshJwtAuthGuard)
	@Get('refresh')
	async refreshTokens(
		@Request() req: any,
		@Res({ passthrough: true }) response: Response
	) {
		return await this.authService.refreshTokens(req.user, response);
	}
	/* NOT SURE ALL THE refreshToken METHOD IS MANDATORY BECAUSE WE HAVE THE GUARD PREVENTING FROM FALSE REFRESH TOKEN
	IT SEEMS THAT THIS IS NOT EVEN NECESSARY TO KEEP THE REFRESH TOKEN IN THE DB */

}
