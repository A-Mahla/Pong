import { Controller,
	Get,
	Post,
	Body,
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
	BadRequestException
} from '@nestjs/common';
import { diskStorage } from  'multer';
import { join } from  'path';
import { createReadStream } from 'fs';
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateUserDto, UpdateUserDto } from './User.dto'
import { UsersService } from './users.service'


@Controller('users')
export class UsersController {

	constructor(private userService: UsersService) {
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
			'message': 'valid infos'
		}
	}

	@Post('signup')
	async handleSignup(@Query() query: {login: string, password: string}) {
		const user = await this.userService.findOneUser(query.login)
		if (user)
			return {
				'statusCode' : 403,
				'message': 'login already use'
			}
		this.createUser({login: query.login, password: query.password})
		return {
			'statusCode': 200,
			'message' : 'user successfully signed in'
		}
	}

	@Get(':login')
	async getUsersbyId(
		@Param('login') login: string,
	) {
		return await this.userService.findOneUser(login);
	}


	@Post()
	createUser(@Body() createUserDto: CreateUserDto) {
		this.userService.createUser(createUserDto);
	}

	@Post(':login/avatar')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: './src/avatar',
			filename: (req, file, cb) => {
				return cb(null, req.params.login + ".jpeg");
			}
		})
	}))
	setAvatar(@UploadedFile() file: Express.Multer.File, @Param('login') login: string) {
		return this.userService.updateAvatar(login, file.filename);
	}

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
