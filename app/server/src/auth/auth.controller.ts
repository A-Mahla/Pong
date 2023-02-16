import { Controller, Post, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor (private readonly authService : AuthService) {}

	@Get('intra42/login')
	async handleToken(@Query() query : {code : string, login: string}) {

		const credentials = await this.authService.exchangeToken(query.code)

		let signedin = false

		if (credentials.access_token == undefined)
			return {
				"statusCode" : 403,
				"message" : "login via intra failed"
			}

		const intraLogin = await this.authService.getIntraLogin(credentials.access_token)

		let user = await this.authService.findOneIntraUser(intraLogin)
		if (user != null)
			signedin = true

		return {
			'statusCode' : 200,
			'body': {
				'user' : JSON.stringify(user),
				'intraLogin': intraLogin,
				'signedin': signedin
			}
		}
	}
}
