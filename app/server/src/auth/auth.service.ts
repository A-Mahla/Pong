import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { jwtConstants } from "./constants";
import { JwtPayload } from './auth.types'


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

	async login(user: any) { // I put any to fit the tutorial but User seem to work fine
		console.log('----------------> LOGIN AuthService function');
		const payload = { sub: user.id, login: user.login }
		const tokens = await this.getTokens(payload)
		await this.usersService.updateRefreshToken(payload.login, tokens.refreshToken)
		return tokens;
	}

	async logout(user: any) {
		await this.usersService.updateRefreshToken(user.login, "");
	}

	async refreshTokens(user: any) {
		const userTry = await this.validateUser(user.login, user.password);
		if (!userTry || !userTry.refreshToken)
		  return null;
		const tokens = await this.getTokens(user);
		await this.usersService.updateRefreshToken(user.login, tokens.refreshToken)
		return tokens;
	  }

	async getTokens(user: JwtPayload) {
		const [accessToken, refreshToken] = await Promise.all([
		  this.jwtService.signAsync(
			{
			  sub: user.sub,
			  login: user.login,
			},
			{
			  secret: jwtConstants.secret,
			  expiresIn: '15m',
			},
		  ),
		  this.jwtService.signAsync(
			{
			  sub: user.sub,
			  login: user.login,
			},
			{
			  secret: jwtConstants.refresh_secret,
			  expiresIn: '7d',
			},
		  ),
		]);

		return {
		  accessToken,
		  refreshToken,
		};
	  }


}
