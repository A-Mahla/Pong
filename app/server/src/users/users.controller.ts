import { Controller,
	Get,
	Post,
	Body,
	Put,
	Delete,
	Patch,
	Param,
	UseInterceptors,
	NestInterceptor,
	UploadedFile,
	Query
} from '@nestjs/common';
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
	async checkLogin(@Query() query: {login: string, password: string}) {
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
	async setAvatar(
		@Param('login') login: string) {
			let newAvatar = (login + ".jpeg");
		return await this.userService.updateAvatar(login, newAvatar)
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
