import { Controller, Post, Query } from '@nestjs/common';
import { CreateUserParams } from 'src/users/User.types';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor (private readonly authService : AuthService, private readonly usersService : UsersService) {}

	@Post('intra42/login')
	async handleToken(@Query() query : {code : string}) {
		const access_token = await this.authService.exchangeToken(query.code) 
		let login = ''

		if (access_token.access_token != undefined)
		{
			const requestOptions = {
				method: "GET",
				headers: {
					'Accept': 'application/json',
					"Authorization" : `Bearer ${access_token.access_token}`
				}

			}

			const response = await fetch('https://api.intra.42.fr/v2/me', requestOptions)
			.then(response => response.json())
			.then(data => login = data["login"])

			const user : CreateUserParams = {
				login: login,
				password: "1234",
			}
			
			this.usersService.createUser(user)

		}


		return access_token 
	}
}
