import { TwoFAService } from './twofa.service';
import {
  ClassSerializerInterceptor,
  Controller,
  Header,
  Param,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('twofa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwofaController {
	constructor(private readonly twoFAService: TwoFAService) {}

	@Post('generate')
	@UseGuards(JwtAuthGuard)
	async register(
		@Res() response: Response, 
		@Request() req: any,
	) {
		const { otpauthUrl } = await this.twoFAService.generateTwoFASecret(req.user.login);

		return this.twoFAService.pipeQrCodeStream(response, otpauthUrl);
	}
}
