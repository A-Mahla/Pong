import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { jwtConstants } from "./constants";
import { JwtPayload } from './auth.types'
import { UserDto } from 'src/users/User.dto';
import { Response } from 'express'


@Injectable()
export class AuthService {
	  constructor(
		private usersService: UsersService,
		private readonly jwtService: JwtService
		){console.log('----------------> AUTHSERVICE constructor');};

	async validateUser(login: string, pass: string): Promise<any>{
		const user = await this.usersService.findOneUser(login);
		if (user && user.password === pass) {
			console.log('----------------> VALIDATEUSER AuthService function');
			const { password, ...result } = user;
			return (result);
		}
		return (null);
	}

	async login(user: any, response: Response) { // I put any to fit the tutorial but User seem to work fine
		console.log('----------------> LOGIN AuthService function   ' + user.login + " AND " + user.id);
		const payload = { sub: user.id, login: user.login }
		const tokens = await this.getTokens(payload, response)
		await this.usersService.updateRefreshToken(payload.login, tokens.refreshToken);
		return {
			aT: tokens.accessToken
		}
	}

	async logout(user: any) {
		await this.usersService.updateRefreshToken(user.login, "");
	}

	async refreshTokens(user: any, response: Response) {
		const userTry = await this.usersService.findOneUser(user.login);
		if (!userTry || userTry.refreshToken !== user.refreshToken )
			return null;
		const tokens = await this.getTokens(user, response);
		await this.usersService.updateRefreshToken(user.login, tokens.refreshToken);
		return {
			aT: tokens.accessToken
		}
	}

	async getTokens(user: JwtPayload, response: Response) {
		const [accessToken, refreshToken] = await Promise.all([
		  this.jwtService.signAsync(
			{
			  sub: user.sub,
			  login: user.login,
			},
			{
			  secret: jwtConstants.secret,
			  expiresIn: '120s',
			},
		  ),
		  this.jwtService.signAsync(
			{
			  sub: user.sub,
			  login: user.login,
			},
			{
			  secret: jwtConstants.refresh_secret,
			  expiresIn: '300s',
			},
		  ),
		]);
		response.cookie('rT', refreshToken, { maxAge: 900000, httpOnly: true});
		response.cookie('aT', accessToken, { maxAge: 900000000, httpOnly: true});
		response.setHeader('access-control-allow-credentials', 'true');
		response.setHeader('access-control-allow-methodes', 'GET, POST, PUT, OPTIONS')
		response.setHeader('access-control-allow-origin', 'http://localhost:5500')
		//response.setHeader('access-control-expose-headers', 'Set-Cookie')
		return {
			accessToken,
			refreshToken
		}

	  }


}
