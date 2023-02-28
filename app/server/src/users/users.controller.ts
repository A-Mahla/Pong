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
	ValidationPipe
} from '@nestjs/common';
import { IsNumberString } from 'class-validator';
import { diskStorage } from  'multer';
import { join } from  'path';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateUserDto, UpdateUserDto } from './User.dto'
import { UsersService } from './users.service'
import { Response } from "express";
import { Request as ExpressRequest } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service'
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RefreshJwtAuthGuard } from 'src/auth/refresh-jwt-auth.guard'
import { Intra42AuthGuard } from 'src/auth/intra42.guard';
import { numberFormat } from './User.dto'


@Controller('users')
export class UsersController {

	constructor(private userService: UsersService,) {}

	@Get()
	async getUsers() { // return all users
		return await this.userService.findUsers();
	}

	@UseGuards(LocalAuthGuard)
	@Get('login')
	async handleLogin(@Query() query: {login: string, password: string}) {
		const user = await this.userService.findOneUser(query.login)
		console.log("user", user)
		console.log("query", query)
		if (!user)
			return {
				'statusCode': 403,
				'message': 'invalid login'
			}
		if (user.password != query.password)
			return {
				'statusCode': 403,
				'message': 'invalid password'
			}
		return {
			'statusCode': 200,
			'message': 'valid infos',
			'body': JSON.stringify(user)
		}
	}

	@Get('intra')
	async getIntraUser(@Query() query: {intraLogin : string}) {
		const intraUser = this.userService.findOneIntraUser(query.intraLogin)
		if (!intraUser)
			return {
				'statusCode' : 403,
				'message': 'no such intra user'
			}
		return {
			'statusCode': 200,
			'message' : 'user successfully signed in',
			'body' : JSON.stringify(intraUser)
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get(':login')
	async getUsersbyId(
		@Param('login') login: string
	) {
		return await this.userService.findOneUser(login);
	}

//	====================== POST AND GET AVATAR ===================
@UseGuards(JwtAuthGuard)
	@Post(':login/avatar')
	@UseInterceptors(FileInterceptor('file', {
	storage: diskStorage({
		destination: './src/avatar',
		filename: (req, file, cb) => {
			return cb(null, req.params.login + ".jpeg");
			},
		}),
	}))
	async checkAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File){
		return this.userService.updateAvatar(req.user.login , file.filename);
	}

	@UseGuards(JwtAuthGuard)
	@Get('avatar/:login')
	async getFile(@Param('login') login : string, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
		try {
			const user = await this.userService.findOneUser(login);
			if (!user) {
				throw new BadRequestException;
			}
			const file = createReadStream(join('./src/avatar/', user.avatar));
			return new StreamableFile(file);
		} catch (error){
			throw new BadRequestException;
		}
	}
//	====================== ^^^^^^^^^^^^^^^^^^^^^^^^^^^ ===================

//	======================= Test Profile  ================================

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	async getProfileInfo(@Request() req: any) {
		return this.userService.getProfileInfo(parseInt(req.user.sub))
	}

//	=========================^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^===============

//	======================== Registering new Game routes ==================
	@Post('newGame')
	async registerNewGame() {
		return (this.userService.registerNewGame());
	}

	@Post('userInGame/:gameId')
	async registerNewPlayer(@Param('gameId') game_id: number, @Body() user: any) {
		return (this.userService.registerNewPlayer(game_id, parseInt(user.id), parseInt(user.score)));
	}


//	======================== ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ================

//	=========================================OAuth2=======================


	@UseGuards(Intra42AuthGuard)
	@Get('intra42/login')
	async handleIntraLogin(@Request() req: any) {
		console.log('handle intra login user info: ', req.intraUserInfo);
		return req.intraUserInfo
	}

	@Post('intra42')
	async createIntraUser(@Query('login') login: string, @Query('intraLogin') intraLogin: string) {
		const user = await this.userService.findOneUser(login)

		if (user)
			return {
				statusCode: 400,
				message: 'login already use'
			}

		return this.userService.createUser({
			login: login,
			password: '',
			intraLogin: intraLogin
		})
	}

	@Put(':login')
	async updateUserById(
		@Param('login') login: string,
		@Body() updateUserDto: UpdateUserDto
	) {
		await this.userService.updateUser(login, updateUserDto);
	}

	@Patch(':login')
	async updatePatchUserById(
		@Param('login') login: string,
		@Body() updateUserDto: UpdateUserDto
	) {
		await this.userService.updateUser(login, updateUserDto);
	}

	@Delete(':login')
	async deleteByID(
		@Param('login') login: string
	) {
		await this.userService.deleteUser(login);
	}
}




/* DONT KNOW WHAT TO DO WITH THAT */

/*
	@Post('signup')
	async handleSignup(
		@Query() query: {
			login: string,
			password: string,
			intraLogin?: string
		},
		@Res({ passthrough: true }) response: Response
	) {
		const user = await this.userService.findOneUser(query.login)
		if (user)
			return {
				'statusCode' : 403,
				'message': 'login already use'
			}
		const newUser = {login: query.login, password: query.password, intraLogin: query.intraLogin}
		this.authService.createUser(newUser, response)
		return {
			'statusCode': 200,
			'message' : 'user successfully signed in',
			'body': JSON.stringify(newUser)
		}
	}

	@Post('intra')
	async handleSignupIntra(
		@Query() query: {
			login: string,
			intraLogin: string
		},
		@Res({ passthrough: true }) response: Response
	) {
		console.log('query: ', query)
		const user = await this.userService.findOneUser(query.login)
		if (user)
			return {
				'statusCode' : 403,
				'message': 'login already use'
			}
		const newUser = {login: query.login, password: "", intraLogin: query.intraLogin}
		this.authService.createUser(newUser, response)
 		return {
			'statusCode': 200,
			'message' : 'user successfully signed in',
			'body' : JSON.stringify(newUser)
		}
	}
*/
