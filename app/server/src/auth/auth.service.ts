import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';


@Injectable()
export class AuthService {
	  constructor(
		private usersService: UsersService,
		private jwtService: JwtService
		){console.log('----------------> AuthService constructor');};

	async validateUser(login: string, pass: string): Promise<any>{
		const user = await this.usersService.findOneUser(login);
		if (user && user.password === pass) {
			console.log('----------------> validateUser AuthService function');
			const { password, ...result } = user;
			return (result);
		}
		return (null);
	}
	async login(user: any){ // I put any to fit the tutorial but User seem to work fine
		const payload = { username: user.login, sub: user.id }
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
