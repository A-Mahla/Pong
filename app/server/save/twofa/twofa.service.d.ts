import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
export declare class TwoFAService {
    private readonly usersService;
    constructor(usersService: UsersService);
    isTwoFACodeValid(twoFACode: string, user: any): Promise<boolean>;
    generateTwoFASecret(login: string): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    QrCode(stream: Response, otpauthUrl: string): Promise<void>;
}
