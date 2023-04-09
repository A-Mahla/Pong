import { Strategy } from "passport-jwt";
import { JwtPayload } from './auth.types';
declare const TwoFATokenStrategy_base: new (...args: any[]) => Strategy;
export declare class TwoFATokenStrategy extends TwoFATokenStrategy_base {
    constructor();
    validate(payload: JwtPayload): JwtPayload;
}
export {};
