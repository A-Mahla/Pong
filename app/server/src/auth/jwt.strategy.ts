import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from "@nestjs/common";
import { jwtConstants} from "./constants";
import { validateHeaderName } from "http";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super ({
			usernameField: 'login',
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: any) {
		return { id: payload.sub, login: payload.login };
	  }
}
