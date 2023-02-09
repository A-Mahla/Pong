import { Controller,
	Get,
	Post,
	Body,
	Put,
	Delete,
	Patch,
	Param,
	ParseIntPipe
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
