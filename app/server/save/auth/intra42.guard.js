"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intra42AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("./auth.service");
let Intra42AuthGuard = class Intra42AuthGuard {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async isSignedIn(intraLogin) {
    }
    async getIntraUserInfo(accessToken) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const response = await fetch('https://api.intra.42.fr/v2/me', requestOptions)
            .then(response => response.json());
        const intraLogin = response['login'];
        const user = await this.usersService.findOneIntraUser(intraLogin);
        const signedIn = (user === null ? false : true);
        return {
            signedIn: signedIn,
            intraLogin: intraLogin,
            user: user,
        };
    }
    async canActivate(context) {
        const code = context.getArgByIndex(0).query.code;
        const request = context.switchToHttp().getRequest();
        const intraResponse = await this.authService.get42ApiToken(code);
        if (intraResponse.statusCode != 200)
            return false;
        const intraUserInfo = await this.getIntraUserInfo(intraResponse['body']['access_token']);
        request.intraUserInfo = intraUserInfo;
        return true;
    }
};
Intra42AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], Intra42AuthGuard);
exports.Intra42AuthGuard = Intra42AuthGuard;
//# sourceMappingURL=intra42.guard.js.map