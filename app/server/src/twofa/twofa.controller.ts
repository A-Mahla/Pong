import {
  ClassSerializerInterceptor,
  UnauthorizedException,
  BadRequestException,
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
  HttpCode,
} from '@nestjs/common';
import { TwoFAService } from './twofa.service';
import { UsersService } from 'src/users/users.service'
import { AuthService } from 'src/auth/auth.service'
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TwoFAJwtAuthGuard } from 'src/auth/2fa-jwt-auth.guard';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwofaController {
	constructor(
		private readonly twoFAService: TwoFAService,
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
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

//	@UseGuards(TwoFAJwtAuthGuard)
	@UseGuards(JwtAuthGuard)
	@Post('turn-on')
	@HttpCode(200)
	async turnOnTFAuthentication(
		@Req() request: any,
		@Body() body : any
	) {

/*		const isCodeValid = await this.twoFAService.isTwoFACodeValid(
			body.twoFACode,
			request.user.login
		);

		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		} */

		await this.usersService.turnOnTwoFA(request.user.id);
	}


	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(TwoFAJwtAuthGuard)
	async authenticate(
		@Req() req: any,
		@Body() body: any,
		@Res({ passthrough: true }) response: Response
	) {

		const user = await this.usersService.findOneUser(req.user.login);

		if (!user)
			throw new BadRequestException();

		const isCodeValid = await this.twoFAService.isTwoFACodeValid(
			body.twoFACode,
			user.login,
		);

		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}

		return await this.authService.login(user, response);

	}

}
