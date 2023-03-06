import {
	Injectable,
	BadRequestException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import * as speakeasy from 'speakeasy';

@Injectable()
export class TwoFAService {
	constructor(
		private readonly usersService: UsersService,
	) {}

	public isTwoFactorAuthenticationCodeValid(twoFACode: string, user: User) {

		if (!user.twoFA)
			throw new BadRequestException;

		return speakeasy.totp.verify({
			secret: user.twoFA,
			encoding: 'base32',
			token: twoFACode,
		})
	}

	public async generateTwoFASecret(login: string) {
		const secret = speakeasy.generateSecret();

		const otpauthUrl = speakeasy.otpauthURL({
			secret: secret.ascii,
			label: `${process.env.TWOFA}`,
			algorithm: 'sha512'
		});

		await this.usersService.setTwoFASecret(secret.ascii, login);

		return {
			secret,
			otpauthUrl
		}
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

}
