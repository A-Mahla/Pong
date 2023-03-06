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
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('twofa')
export class TwofaController {
	constructor(private readonly twoFAService: TwoFAService) {}

	@Post('generate')
	@UseGuards(JwtAuthGuard)
	async register(
		@Res() response: Response, 
		@Param() login: string,
	) {
		const { otpauthUrl } = await this.twoFAService.generateTwoFASecret(login);

		return this.twoFAService.pipeQrCodeStream(response, otpauthUrl);
	}
}
