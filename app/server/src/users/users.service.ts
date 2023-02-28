import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User, User_Game, Games } from '@prisma/client';
import { GameService } from 'src/game/game.service';
import { CreateUserParams, UpdateUserParams, profile } from './User.types'
import { FileInterceptor } from '@nestjs/platform-express'
import { ok } from 'assert';

@Injectable()
export class UsersService {

	constructor( private prisma: PrismaService,
				 private readonly gameService: GameService ) {}

	async findUsers(): Promise<User[]> {
		return this.prisma.user.findMany()
	}

	async findOneUser(login: string) : Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: { login: login }
		}).catch((e) => {
			throw new BadRequestException(); // maybe we will have to specifie the error later
		})
	}

	async findOneIntraUser(intraLogin: string) : Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { intraLogin: intraLogin }
		}).catch((e) => {
			throw new BadRequestException(); // maybe we will have to specifie the error later
		});
	}

	async updateUser(login: string, updateUserDetails: UpdateUserParams) : Promise<User> {
		return await this.prisma.user.update({
			where: { login: login },
			data: { ...updateUserDetails }
		}).catch((e) => {
			throw new BadRequestException(); // maybe we will have to specifie the error later
		})
	}

	async updateRefreshToken(login: string, refreshToken: string) {
		return await this.prisma.user.update({
			where: { login: login },
			data : { refreshToken: refreshToken }
		}).catch((e) => {
			throw new BadRequestException(); // maybe we will have to specifie the error later
		});
	}


	async updateAvatar(login: string, avatar: string) {
		return await this.prisma.user.update({
			where: { login: login },
			data : { avatar: avatar }
		}).catch((e) => {
			throw new BadRequestException(); // maybe we will have to specifie the error later
		});
	}

	async deleteUser(login: string) : Promise<User> {
		return this.prisma.user.delete({
			where: { login: login }
		}).catch((e) => {
			throw new BadRequestException(); // maybe we will have to specifie the error later
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
		}).catch((e) => {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
				  console.log('unique constraint violation')
				}
			  }
			  throw e
		});
	}

/* ============================ get profile ========================*/

	async getProfileInfo(user_id: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: user_id
			},
			select: {
				login: true,
				avatar: true
			}
		})
		return {
			login: user?.login,
			avatar: user?.avatar,
			nbGames: (await this.gameService.getNbGames(user_id)),
			nbWin: (await this.gameService.getVictoryLossCountForUser(user_id, true)),
			nbLoss: (await this.gameService.getVictoryLossCountForUser(user_id, false)),
		};
	}



}
/* ============================ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ========================*/

