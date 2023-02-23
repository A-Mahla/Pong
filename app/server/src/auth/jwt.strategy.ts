import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { jwtConstants} from "./constants";
import { validateHeaderName } from "http";
import { JwtPayload } from './auth.types'
import { Request } from 'express'
import { Req } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super ({
			usernameField: 'login',
			jwtFromRequest: ExtractJwt.fromExtractors([(request:Request) => {
                const data = request?.cookies["aT"];
                if(!data){
                    return null;
                }
                return data
            }]),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: JwtPayload) {
		return payload;
	  }
}
