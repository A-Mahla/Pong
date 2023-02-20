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
} from '@nestjs/common';
import { diskStorage } from  'multer';
import { join } from  'path';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateUserDto, UpdateUserDto } from './User.dto'
import { UsersService } from './users.service'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service'
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('users')
export class UsersController {

	constructor(private userService: UsersService,
		private authService: AuthService) {
	}

	@Get()
	async getUsers() {
		return await this.userService.findUsers();
	}

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

	@Post('signup')
	async handleSignup(@Query() query: {login: string, password: string, intraLogin?: string}) {
		const user = await this.userService.findOneUser(query.login)
		if (user)
			return {
				'statusCode' : 403,
				'message': 'login already use'
			}
		const newUser = {login: query.login, password: query.password, intraLogin: query.intraLogin}
		this.createUser(newUser)
		return {
			'statusCode': 200,
			'message' : 'user successfully signed in',
			'body': JSON.stringify(newUser)
		}
	}

	@Post('intra')
	async handleSignupIntra(@Query() query: {login: string, intraLogin: string}) {
		console.log('query: ', query)
		const user = await this.userService.findOneUser(query.login)
		if (user)
			return {
				'statusCode' : 403,
				'message': 'login already use'
			}
		const newUser = {login: query.login, password: "", intraLogin: query.intraLogin}
		this.createUser(newUser)
 		return {
			'statusCode': 200,
			'message' : 'user successfully signed in',
			'body' : JSON.stringify(newUser)
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

	@Get(':login')
	async getUsersbyId(
		@Param('login') login: string,
	) {
		return await this.userService.findOneUser(login);
	}

	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
  	async login(@Request() req: any) {
		return this.authService.login(req.user);
	}

	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(createUserDto);
	}


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

	//@UseGuards(JwtAuthGuard)
	@Get('stats/:login')
	getStats(@Param('login') login : string) {
		return this.userService.getProfile(login);
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
