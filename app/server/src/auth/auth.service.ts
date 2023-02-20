import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';


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
	async login(user: any){ // I put any to fit the tutorial but User seem to work fine
		console.log('----------------> LOGIN AuthService function');
		const payload = { login: user.login, sub: user.id }
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
