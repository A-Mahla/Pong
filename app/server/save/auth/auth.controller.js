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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const User_dto_1 = require("../users/User.dto");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("./auth.service");
const local_auth_guard_1 = require("./local-auth.guard");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const refresh_jwt_auth_guard_1 = require("./refresh-jwt-auth.guard");
const intra42_guard_1 = require("./intra42.guard");
let AuthController = class AuthController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async createUser(createUserDto, response) {
        return this.authService.loginWithId(await this.userService.createUser(createUserDto), response);
    }
    async login(req, response) {
        if (req.user.isTwoFA) {
            await this.authService.getTwoFAToken({
                sub: req.user.id,
                login: req.user.login
            }, response);
            return {
                aT: '2faActivate',
                id: req.user.id
            };
        }
        const test = (await this.authService.loginWithId(req.user, response));
        return test;
    }
    async logout(user, response) {
        return await this.authService.logout(user, response);
    }
    async refreshTokens(req, response) {
        return await this.authService.refreshTokens(req.user, response);
    }
    async changePassword(req, updateUserParam, response) {
        if (!updateUserParam.login)
            throw new common_1.BadRequestException;
        if (!await this.userService.findIfExistUser(updateUserParam.login)) {
            await this.userService.updateUser(req.user.login, updateUserParam);
            return await this.authService.login({
                id: req.user.sub,
                login: updateUserParam.login
            }, response);
        }
        else {
            throw new common_1.BadRequestException('unvailable');
        }
    }
    async handleIntraLogin(req, response) {
        const { signedIn, intraLogin, user } = req.intraUserInfo;
        if (req.intraUserInfo.signedIn) {
            let accessToken;
            if (req.intraUserInfo.user.isTwoFA) {
                await this.authService.getTwoFAToken({
                    sub: req.intraUserInfo.user.id,
                    login: req.intraUserInfo.user.login
                }, response);
                accessToken = {
                    aT: '2faActivate'
                };
            }
            else {
                accessToken = await this.authService.login(req.intraUserInfo.user, response);
            }
            return {
                signedIn: signedIn,
                intraLogin: intraLogin,
                login: user.login,
                id: user.id,
                token: accessToken['aT']
            };
        }
        return {
            signedIn: signedIn,
            intraLogin: intraLogin,
        };
    }
    async createIntraUser(login, intraLogin, body, response) {
        if (body['intraLogin'] !== intraLogin)
            throw new common_1.HttpException('Bad Request', common_1.HttpStatus.BAD_REQUEST);
        const ifExist = await this.userService.findIfExistUser(login);
        if (ifExist)
            throw new common_1.HttpException('login unavailable', common_1.HttpStatus.FORBIDDEN);
        const token = await this.authService.loginWithId(await this.userService.createUser({
            login: login,
            password: '',
            intraLogin: intraLogin
        }), response);
        return {
            login: login,
            id: token['id'],
            aT: token['aT'],
        };
    }
};
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(refresh_jwt_auth_guard_1.RefreshJwtAuthGuard),
    (0, common_1.Get)('refresh'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('profile/login'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(intra42_guard_1.Intra42AuthGuard),
    (0, common_1.Get)('intra42/login'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleIntraLogin", null);
__decorate([
    (0, common_1.Post)('intra42'),
    __param(0, (0, common_1.Query)('login')),
    __param(1, (0, common_1.Query)('intraLogin')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createIntraUser", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map