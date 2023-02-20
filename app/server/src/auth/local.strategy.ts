import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    console.log('----------------> LOCALSTRATEGY constructor');
    super({usernameField: 'login'});
  }

  async validate(login: string, password: string) {
    console.log('----------------> LOCALSTRATEGY validate function');
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      console.log(user);
      throw new UnauthorizedException();
    }
    return user;

  }

}
