import { BadGatewayException, BadRequestException, Injectable, UseInterceptors, UploadedFile, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User, User_Game, Games } from '@prisma/client';

@Injectable()
export class GameService {
	constructor( private prisma: PrismaService,) {}


/* ============================ POST game related information ========================*/
	async registerNewGame(status: string) {
		return this.prisma.games.create({
			data: {
				status: status
			}
		}).catch((e) => {throw e})
	}
	async registerNewPlayer(game_id: number, user_id: number, score: number) {
		const newUserGame = {
			game_id: game_id,
			user_id: user_id,
			score: score,
		};
		const newPlayer = await this.prisma.user_Game.create({
			data: newUserGame
		}).catch((e) => {throw new BadRequestException(e)})
		if (await this.checkPlayerInGame(game_id) === 2)
		{
			await this.prisma.games.update({
				where: {
					game_id: game_id
				},
				data : {
					status: 'OK'
				}}).catch((e) => {
					throw new BadRequestException(e)
				})
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
		}).catch((e) => {throw e})
	}


	async gamesbyStatus(statusTofind: string) {
		return (this.prisma.games.findMany({
			where: {
				status: statusTofind
			}
		}))
	}
//	================ GET SOME STATS ABOUT GAME AND USERGAME ===========

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
		}).catch((e) => {throw e})
		console.log(nbGames);
		return nbGames;
	}


	//	================ UPDATE GAME STATUS ===========
	async updateGamestatus(game_id: number, status: string) {
		return this.prisma.games.update({
			where: {
				game_id: game_id
			},
			data : {
				status: status
			}
		}).catch((e) => {
			throw new BadRequestException(e)
		})
	}
}


//	================ ^^^^^^^^^^^^^^^^^^ ===========


