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
	UsePipes,
	ValidationPipe,
	HttpStatus
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/users/User.dto'
import { UsersService } from 'src/users/users.service'
import { Response } from "express";
import { Request as ExpressRequest } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service'
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { TwoFAJwtAuthGuard } from 'src/auth/2fa-jwt-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RefreshJwtAuthGuard } from 'src/auth/refresh-jwt-auth.guard'
import { Intra42AuthGuard } from 'src/auth/intra42.guard'


@Controller('auth')
export class AuthController {

	constructor(private userService: UsersService,
		private authService: AuthService) {
	}
	/* -------------- basic authentication routes ---------------- */

	@Post('signup')
	//@UsePipes(new ValidationPipe({ transform: true }))
	async createUser(
		@Body() createUserDto: CreateUserDto,
		@Res({ passthrough: true }) response: Response
	) {
		return this.authService.loginWithId(
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

		if (req.user.isTwoFA) {
			await this.authService.getTwoFAToken(
				{
					sub: req.user.id,
					login: req.user.login
				},
				response
			)
			return {
				aT: '2faActivate'
			};
		}

		return await this.authService.loginWithId(req.user, response);
	}

	@Post('logout')
  	async logout(
		@Body() user: { login: string },
		@Res({ passthrough: true }) response: Response
	) {
		return await this.authService.logout(user, response);
	}

	@UseGuards(RefreshJwtAuthGuard)
	@Get('refresh')
	async refreshTokens(
		@Request() req: any,
		@Res({ passthrough: true }) response: Response
	) {
		return await this.authService.refreshTokens(req.user, response);
	}

	// ========================================= 2FA ======================


/*	@UseGuards(TwoFAJwtAuthGuard)
	@Post('2fa')
	async validateCode (
		@Request() req: any,
		@Res({ passthrough: true }) response: Response
	) {
		return await this.authService.login(req.user, response);
	}
*/

	//	=========================================OAuth2=======================

	@UseGuards(Intra42AuthGuard)
	@Get('intra42/login')
	async handleIntraLogin(
		@Request() req: any,
		@Res({ passthrough: true }) response: Response
	) {

		const {signedIn, intraLogin, user} = req.intraUserInfo;

		if (req.intraUserInfo.signedIn) {


			let accessToken;

			if (req.intraUserInfo.user.isTwoFA) {
				await this.authService.getTwoFAToken(
					{
						sub: req.intraUserInfo.user.id,
						login: req.intraUserInfo.user.login
					},
					response
				)
				accessToken = {
					aT: '2faActivate'
				};
			} else {
				accessToken = await this.authService.login(req.intraUserInfo.user, response)
			}

			return {
				signedIn: signedIn,
				intraLogin: intraLogin,
				login: user.login,
				id: user.id,
				token: accessToken['aT']
			}
		}
		return {
			signedIn: signedIn,
			intraLogin: intraLogin,
			login: user.login,
			id: user.id,
		}
	}

	@Post('intra42')
	async createIntraUser(
		@Query('login') login: string,
		@Query('intraLogin') intraLogin: string,
		@Body() body: any,
		@Res({ passthrough: true }) response: Response
	) {


		if (body['intraLogin'] !== intraLogin )
			throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
	
		const ifExist = await this.userService.findIfExistUser(login)

		if (ifExist)
			throw new HttpException('login unavailable', HttpStatus.FORBIDDEN);

		const token = await this.authService.loginWithId(
			await this.userService.createUser({
				login: login,
				password: '',
				intraLogin: intraLogin
			}),
			response
		)

		return {
			login: login,
			id: token['id'],
			aT: token['aT'],
		}
	}	

}
