import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { diskStorage } from  'multer';
import { CreateUserParams, UpdateUserParams } from './User.types'
import { FileInterceptor } from '@nestjs/platform-express'

@Injectable()
export class UsersService {

	constructor( private prisma: PrismaService,) {}

	async findUsers(): Promise<User[]> {
		return this.prisma.user.findMany()
	}

	async findOneUser(login: string) : Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: { login: login }
		})
	}

	async updateUser(login: string, updateUserDetails: UpdateUserParams) : Promise<User> {
		return this.prisma.user.update({
			where: { login: login },
			data: { ...updateUserDetails }
		})
	}

	async updateAvatar(login: string, avatar: string) {
		return await this.prisma.user.update({
			where: { login: login },
			data : { avatar: avatar }
		});
	}

	async deleteUser(login: string) : Promise<User> {
		return this.prisma.user.delete({
			where: { login: login }
		})
	}

	async createUser(userDetails: CreateUserParams): Promise<User> {
		const newUser = {
			createdAt: new Date(),
			...userDetails,
		};
		console.log("create prisma user: ", newUser)
		return this.prisma.user.create({
			data: { ...newUser }
		});
	}

	setAvatar(@Param('login') login: string, @UploadedFile() file: Express.Multer.File) {
			return this.updateAvatar(login, file.filename);
	}
}

