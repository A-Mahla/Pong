import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { response } from 'express';
import { cp } from 'fs';
import { CreateUserDto } from 'src/users/User.dto';

@Injectable()
export class AuthService {
	constructor() {}

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

	async addUser(user : CreateUserDto) {
		const requestOptions = {
			method: "POST",
			headers: {
				"Accept" : "application/json",
				"Content-Type" : "application/json"
			},
			body: JSON.stringify(user)
		}	

		console.log(requestOptions)

		await fetch("http://server_db:5500/api/users", requestOptions)
		.then(response => response.json)
		.then(data => console.log(data))
		.catch(err => console.log(err))

	}
}
