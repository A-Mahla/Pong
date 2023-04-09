import { CreateUserDto } from 'src/users/User.dto';
import { UsersService } from 'src/users/users.service';
import { Response } from "express";
import { AuthService } from 'src/auth/auth.service';
export declare class AuthController {
    private userService;
    private authService;
    constructor(userService: UsersService, authService: AuthService);
    createUser(createUserDto: CreateUserDto, response: Response): Promise<{
        id: any;
        aT: string;
    }>;
    login(req: any, response: Response): Promise<{
        id: any;
        aT: string;
    }>;
    logout(user: {
        login: string;
    }, response: Response): Promise<void>;
    refreshTokens(req: any, response: Response): Promise<{
        aT: string;
    }>;
    changePassword(req: any, updateUserParam: any, response: Response): Promise<{
        aT: string;
    }>;
    handleIntraLogin(req: any, response: Response): Promise<{
        signedIn: any;
        intraLogin: any;
        login: any;
        id: any;
        token: string;
    } | {
        signedIn: any;
        intraLogin: any;
        login?: undefined;
        id?: undefined;
        token?: undefined;
    }>;
    createIntraUser(login: string, intraLogin: string, body: any, response: Response): Promise<{
        login: string;
        id: any;
        aT: string;
    }>;
}
