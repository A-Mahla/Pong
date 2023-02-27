import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User, User_Game, Games } from '@prisma/client';
import { diskStorage } from  'multer';
import { statsFormat, CreateUserParams, UpdateUserParams, profile } from './User.types'
import { FileInterceptor } from '@nestjs/platform-express'
import { ok } from 'assert';

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

	async findOneIntraUser(intraLogin: string) : Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { intraLogin: intraLogin }
		});
	}

	async updateUser(login: string, updateUserDetails: UpdateUserParams) : Promise<User> {
		return await this.prisma.user.update({
			where: { login: login },
			data: { ...updateUserDetails }
		})
	}

	async updateRefreshToken(login: string, refreshToken: string) {
		return await this.prisma.user.update({
			where: { login: login },
			data : { refreshToken: refreshToken }
		});
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
		}).catch((e) => {throw e});
	}

/* ============================ POST game related information ========================*/
	async registerNewGame() {
		return this.prisma.games.create({
			data: {}
		})
	}
	async registerNewPlayer(game_id: number, user_id: number, score: number) {
		const newUserGame = {
			game_id: game_id,
			user_id: user_id,
			score: score,
		};
		const newPlayer = await this.prisma.user_Game.create({
			data: newUserGame
		})
		let testVar = await this.checkPlayerInGame(game_id);
		if (testVar === 2)
		{
			let testVar2 = await this.prisma.games.update({
				where: {
					game_id: game_id
				},
				data : {
					status: 'OK'
				} })
		}
		return newPlayer;
	}

	async checkPlayerInGame(game_id: number) {
		return await this.prisma.user_Game.count({
			where: {
				game_id: {
				  equals: game_id,
				},
			  },
		})
	}
/* ============================ get profile and stats service ========================*/

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
			nbGames: (await this.getNbGames(user_id)),
			nbWin: (await this.getVictoryLossCountForUser(user_id, true)),
			nbLoss: (await this.getVictoryLossCountForUser(user_id, false)),
		};
	}


	async getVictoryLossCountForUser(userId: number, InfSup: boolean) {
		const games = await this.prisma.user_Game.findMany({
		  where: {
			user_id: userId,
		  },
		  include: {
			game: {
			  include: {
				players: true,
			  },
			},
		  },
		});

		let victories = 0;
		games.forEach((game) => {
		  const otherPlayers = game.game.players.filter(
			(player) => player.user_id !== userId
		  );
		  const otherPlayerScore = otherPlayers[0]?.score || 0;
		  if (InfSup && game.score > otherPlayerScore)
			victories++;
		  else if (!InfSup && game.score < otherPlayerScore)
			victories++;
		});

		return victories;
	  }

	async getNbGames(user_id: number) {
		const nbGames = await this.prisma.user_Game.count({
			where: {
				user_id: {
					equals: user_id
				}
			}
		})
		console.log(nbGames);
		return nbGames;
	}

}
/* ============================ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ========================*/

