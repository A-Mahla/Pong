import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";
type IntraUserInfo = {
    signedIn: boolean;
    intraLogin: string;
    user: User | null;
    token?: string;
};
export declare class Intra42AuthGuard implements CanActivate {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    isSignedIn(intraLogin: string): Promise<void>;
    getIntraUserInfo(accessToken: string): Promise<IntraUserInfo>;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
