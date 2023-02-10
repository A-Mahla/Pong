import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserParams, UpdateUserParams } from './User.types'

@Injectable()
export class UsersService {

	constructor( private prisma: PrismaService,) {}

	async findUsers(): Promise<User[]> {
		return this.prisma.user.findMany()
	}

	async findOneUser(login: string) : Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { login: login }
		});
	}

	async updateUser(login: string, updateUserDetails: UpdateUserParams) : Promise<User> {
		return this.prisma.user.update({
			where: { login },
			data: { ...updateUserDetails }
		})
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
		return this.prisma.user.create({
			data: { ...newUser }
		});
	}
}

