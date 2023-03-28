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
import { CreateUserDto, UpdateUserDto,numberFormat } from 'src/users/User.dto'
import { UsersService } from 'src/users/users.service'
import { Response } from "express";
import { Request as ExpressRequest } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service'
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RefreshJwtAuthGuard } from 'src/auth/refresh-jwt-auth.guard'
import { Intra42AuthGuard } from 'src/auth/intra42.guard';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

//	======================== Registering new Game routes ==================
	@UseGuards(JwtAuthGuard)
	@Post('newGame')
	async registerNewGame() {
		return (this.gameService.registerNewGame('--'));
	}

	@UseGuards(JwtAuthGuard)
	@Post('userInGame/:gameId')
	async registerNewPlayer(@Param('gameId') game_id: number, @Body() user: any) {
		return (this.gameService.registerNewPlayer(game_id, parseInt(user.id), parseInt(user.score)));
	}

//	======================== ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ================
//	======================== Getting Game information ==================
	@Get('gamewatinglist')
	async getGameWaitingList() {
		return (
			this.gameService.gamesbyStatus('WAIT')
		);
	}

	//@UseGuards(JwtAuthGuard)
	@Get('gamehistory/:id')
	async getGameHistory(@Param('id') user_id: number) {
		const test = await this.gameService.gameHistory(user_id);
		console.log(test);
	}

//	======================== Getting raw stats about a player game ================

	//@UseGuards(JwtAuthGuard)
	@Get('stats/nbGames/:id')
	async getnbGames(@Param('id') user_id: number) {
		return (this.gameService.getNbGames(user_id));
	}

	//@UseGuards(JwtAuthGuard)
	@Get('stats/nbVictory/:id')
	async getnbVictory(@Param('id') user_id: number) {
		return (this.gameService.getVictoryLossCountForUser(user_id, true));
	}

	//@UseGuards(JwtAuthGuard)
	@Get('stats/nbLoss/:id')
	async getnbLoss(@Param('id') user_id: number) {
		return (this.gameService.getVictoryLossCountForUser(user_id, false));
	}


}
