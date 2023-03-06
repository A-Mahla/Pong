import { TwoFAService } from './twofa.service';
import {
  ClassSerializerInterceptor,
  Controller,
  Header,
  Param,
  Post,
  Get,
  UseInterceptors,
  Res,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwofaController {
	constructor(private readonly twoFAService: TwoFAService) {}

	@Get('generate')
	@UseGuards(JwtAuthGuard)
	async register(
		@Res() response: Response, 
		@Request() req: any,
	) {
		const { otpauthUrl } = await this.twoFAService.generateTwoFASecret(req.user.login);

		return this.twoFAService.pipeQrCodeStream(response, otpauthUrl);
	}
}
