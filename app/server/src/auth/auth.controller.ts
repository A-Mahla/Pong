import { Controller, Post, Query, Get } from '@nestjs/common';
import { CreateUserParams } from 'src/users/User.types';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor (private readonly authService : AuthService, private readonly usersService : UsersService) {}

	@Get('intra42/login')
	async handleToken(@Query() query : {code : string, login: string}) {
		const access_token = await this.authService.exchangeToken(query.code) 
		let loginIntra = ""
		let signedin = false

		if (access_token.access_token == undefined)
			return {
				"statusCode" : 403,
				"message" : "login via intra failed"
			}

		const requestOptions = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				"Authorization" : `Bearer ${access_token.access_token}`
			}
		}

		const response = await fetch('https://api.intra.42.fr/v2/me', requestOptions)
		.then(response => response.json())
		.then(data => loginIntra = data["login"])

		if (this.usersService.findOneIntraUser(loginIntra) != null)
			signedin = true


		return {
			'statusCode' : 200,
			'body': {
				'intraLogin': loginIntra,
				'signedin': signedin
			}
		} 
	}
}
