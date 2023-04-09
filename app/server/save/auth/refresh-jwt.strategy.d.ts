import { Strategy } from "passport-jwt";
import { Request } from 'express';
import { JwtPayload } from './auth.types';
declare const RefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    constructor();
    validate(request: Request, payload: JwtPayload): {
        refreshToken: any;
        sub: number;
        login: string;
    };
}
export {};
