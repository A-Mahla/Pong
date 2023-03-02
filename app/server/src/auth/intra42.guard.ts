import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";

type IntraUserInfo = {
	signedIn: boolean,
	intraLogin: string,
	login?: string,
	token?: string,
}

@Injectable()
export class Intra42AuthGuard implements CanActivate {
	constructor (private readonly authService : AuthService, 
					private readonly usersService : UsersService) {}

	async isSignedIn (intraLogin: string) {
	}

	async getIntraUserInfo (accessToken: string) : Promise<IntraUserInfo> {

		console.log('acces_token', accessToken)

		const requestOptions = {
			method: 'GET',
			headers: {
				'Authorization' : `Bearer ${accessToken}`
			}
		}

		const response = await fetch('https://api.intra.42.fr/v2/me', requestOptions)
		.then(response => response.json())

		const intraLogin = response['login']

		const user = await this.usersService.findOneIntraUser(intraLogin)

		const signedIn = (user === null ? false : true)	

		const login = (user === null ? undefined : user.login)	

		const token = (user === null ? undefined : (await this.authService.refreshTokens(user.login, response)))

		return {
			signedIn: signedIn,
			intraLogin: intraLogin,
			login: login,
			token: token?.aT
		}
	}

	async canActivate (context: ExecutionContext) : Promise<boolean>{

		const code = context.getArgByIndex(0).query.code

		const request = context.switchToHttp().getRequest()

		const intraResponse = await this.authService.get42ApiToken(code)

		console.log('intraResponse: ', intraResponse)

		if (intraResponse.statusCode != 200)
			return false


		const intraUserInfo = await this.getIntraUserInfo(intraResponse['body']['access_token'])

		request.intraUserInfo = intraUserInfo

		return true
	}


}
