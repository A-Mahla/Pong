import { TwoFAService } from './twofa.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
export declare class TwofaController {
    private readonly twoFAService;
    private readonly usersService;
    private readonly authService;
    constructor(twoFAService: TwoFAService, usersService: UsersService, authService: AuthService);
    register(response: Response, req: any): Promise<void>;
    isActivate(request: any, body: any): Promise<{
        isTfaActivate: boolean;
    }>;
    turnOffTFAuthentication(request: any, body: any): Promise<import(".prisma/client").User>;
    authenticate(req: any, { twoFA }: any, response: Response): Promise<{
        aT: string;
    }>;
    authenticateFirst(req: any, { twoFA }: any, response: Response): Promise<import(".prisma/client").User>;
    checkToken(req: any): Promise<{
        login: any;
        id: any;
    }>;
}
