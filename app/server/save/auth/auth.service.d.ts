import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.types';
import { Response } from 'express';
export declare class AuthService {
    private usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(login: string, pass: string): Promise<any>;
    login(user: any, response: Response): Promise<{
        aT: string;
    }>;
    loginWithId(user: any, response: Response): Promise<{
        id: any;
        aT: string;
    }>;
    logout(user: any, response: Response): Promise<void>;
    refreshTokens(user: any, response: Response): Promise<{
        aT: string;
    }>;
    getTwoFAToken(user: JwtPayload, response: Response): Promise<void>;
    getTokens(user: JwtPayload, response: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    get42ApiToken(client_code: string): Promise<{
        statusCode: number;
        body: any;
    }>;
}
