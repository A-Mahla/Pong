import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/User.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private readonly usersService : UsersService) {}

	async exchangeToken (code : string) {

		const grant_type = 'authorization_code';
		const client_id = process.env.API_UID;
		const client_secret = process.env.API_SECRET;
		const redirect_uri = 'http://localhost:3000/redirect'

		const requestOptions = {
			method: "POST",
			header: {
				"Accept-Encoding" : "application/json"
			}
		}

		let access_token : string | undefined = ''

		const response = await fetch("https://api.intra.42.fr/v2/oauth/token?" +
			`grant_type=${grant_type}&` +
			`client_id=${client_id}&` +
			`client_secret=${client_secret}&` +
			`code=${code}&` +
			`redirect_uri=${redirect_uri}`
		, requestOptions)
		.then(response => response.json())
		.then(data => access_token = data['access_token'])
		
		if (access_token != undefined)
		{
			return {"access_token" : access_token}
		}
		return {"access_token" :undefined}
	}

	async createUser(user : CreateUserDto) {
		return this.usersService.createUser(user)
	}

	async findOneIntraUser(intraLogin : string) {
		return this.usersService.findOneIntraUser(intraLogin)
	}

	async getIntraLogin(access_token : string) {

		let intraLogin: string

		const requestOptions = {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				"Authorization" : `Bearer ${access_token}`
			}
		}

		const response = await fetch('https://api.intra.42.fr/v2/me', requestOptions)
		.then(response => response.json())

		return await response['login'];

	}
}
