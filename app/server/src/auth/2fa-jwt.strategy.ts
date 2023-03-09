import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { Request } from 'express';
import { jwtConstants} from "./constants";
import { JwtPayload } from './auth.types'

@Injectable()
export class TwoFATokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-2fa'
) {
	constructor() {
		super({
			usernameField: 'login',
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                const data = request?.cookies[`${jwtConstants.twofa_jwt_name}`];
                if(!data){
                    return null;
                }
                return data
            }]),
			secretOrKey: jwtConstants.twofa_jwt_secret,
			ignoreExpiration: false
		  });
	}

	validate(payload: JwtPayload) {
		return payload;
	}
}
