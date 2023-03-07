import {
  ClassSerializerInterceptor,
  UnauthorizedException,
  Controller,
  Header,
  Param,
  Body,
  Post,
  Get,
  UseInterceptors,
  Res,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { TwoFAService } from './twofa.service';
import { UsersService } from 'src/users/users.service'
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwofaController {
	constructor(
		private readonly twoFAService: TwoFAService,
		private readonly usersService: UsersService
	) {}

	@UseGuards(JwtAuthGuard)
	@Post('generate')
	async register(
		@Res() response: Response, 
		@Request() req: any,
	) {
		const { otpauthUrl } = await this.twoFAService.generateTwoFASecret(req.user.login);

		return this.twoFAService.QrCode(response, otpauthUrl);
	}

	@Post('on')
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(
		@Req() request: any,
		@Body() body : any
	) {

		const isCodeValid = await this.twoFAService.isTwoFACodeValid(
			body.twoFACode,
			request.user.login
		);

		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}

		await this.usersService.turnOnTwoFA(request.user.id);
	}

}
