import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadGatewayException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    console.log('----------------> localStrategy constructor');
    super({usernameField: 'login'});
  }

  async validate(login: string, password: string) {
    console.log('----------------> localStrategy validate function');
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      console.log(user);
      throw new UnauthorizedException();
    }
    return user;

  }

}
