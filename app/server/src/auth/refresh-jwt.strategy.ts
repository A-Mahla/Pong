import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { Request } from 'express';
import { jwtConstants} from "./constants";


type JwtPayload = {
	sub: number;
	login: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	constructor() {
		super({
			usernameField: 'login',
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: jwtConstants.refresh_secret,
			passReqToCallback: true,
			ignoreExpiration: false
		  });
	}

	validate(req: Request, payload: JwtPayload) {
		const refreshToken = req.get('Authorization')!.replace('Bearer', '').trim();
		return { ...payload, refreshToken };
	}
}
