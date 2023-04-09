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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./constants");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(login, pass) {
        const user = await this.usersService.findOneUser(login);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password } = user, result = __rest(user, ["password"]);
            return (result);
        }
        return (null);
    }
    async login(user, response) {
        const payload = { sub: user.id, login: user.login };
        const tokens = await this.getTokens(payload, response);
        await this.usersService.updateRefreshToken(payload.login, tokens.refreshToken);
        return {
            aT: tokens.accessToken
        };
    }
    async loginWithId(user, response) {
        const payload = { sub: user.id, login: user.login };
        const tokens = await this.getTokens(payload, response);
        await this.usersService.updateRefreshToken(payload.login, tokens.refreshToken);
        return {
            id: user.id,
            aT: tokens.accessToken
        };
    }
    async logout(user, response) {
        await this.usersService.updateRefreshToken(user.login, "");
        response.clearCookie(`${constants_1.jwtConstants.refresh_jwt_name}`, {
            maxAge: 5000,
            httpOnly: true,
            sameSite: 'strict',
        });
    }
    async refreshTokens(user, response) {
        const userTry = await this.usersService.findOneUser(user.login);
        const tokens = await this.getTokens(user, response);
        await this.usersService.updateRefreshToken(user.login, tokens.refreshToken);
        return {
            aT: tokens.accessToken
        };
    }
    async getTwoFAToken(user, response) {
        const accessToken = await this.jwtService.signAsync({
            sub: user.sub,
            login: user.login,
        }, {
            secret: constants_1.jwtConstants.twofa_jwt_secret,
            expiresIn: '5m',
        });
        response.cookie(`${constants_1.jwtConstants.twofa_jwt_name}`, accessToken, {
            maxAge: 300000,
            httpOnly: true,
            sameSite: 'strict'
        });
    }
    async getTokens(user, response) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: user.sub,
                login: user.login,
            }, {
                secret: constants_1.jwtConstants.jwt_secret,
                expiresIn: '10m',
            }),
            this.jwtService.signAsync({
                sub: user.sub,
                login: user.login,
            }, {
                secret: constants_1.jwtConstants.refresh_jwt_secret,
                expiresIn: '7d',
            }),
        ]);
        response.cookie(`${constants_1.jwtConstants.refresh_jwt_name}`, refreshToken, {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: 'strict'
        });
        return {
            accessToken,
            refreshToken
        };
    }
    async get42ApiToken(client_code) {
        const requestOptions = {
            method: 'POST',
            header: {
                'Accept-Encoding': 'application/json'
            }
        };
        const grant_type = 'authorization_code';
        const client_id = process.env.VITE_API_UID;
        const client_secret = process.env.API_SECRET;
        const code = client_code;
        const redirect_uri = `http://localhost:8080/redirect`;
        const response = await fetch('https://api.intra.42.fr/v2/oauth/token?' +
            `grant_type=${grant_type}&` +
            `client_id=${client_id}&` +
            `client_secret=${client_secret}&` +
            `code=${code}&` +
            `redirect_uri=${redirect_uri}`, requestOptions)
            .then(response => response.json());
        if (response['error'])
            return {
                statusCode: 403,
                body: response
            };
        return {
            statusCode: 200,
            body: response
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map