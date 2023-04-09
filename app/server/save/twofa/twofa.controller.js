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
exports.TwofaController = void 0;
const common_1 = require("@nestjs/common");
const twofa_service_1 = require("./twofa.service");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/auth.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const _2fa_jwt_auth_guard_1 = require("../auth/2fa-jwt-auth.guard");
const constants_1 = require("../auth/constants");
let TwofaController = class TwofaController {
    constructor(twoFAService, usersService, authService) {
        this.twoFAService = twoFAService;
        this.usersService = usersService;
        this.authService = authService;
    }
    async register(response, req) {
        const { otpauthUrl } = await this.twoFAService.generateTwoFASecret(req.user.login);
        return this.twoFAService.QrCode(response, otpauthUrl);
    }
    async isActivate(request, body) {
        const user = await this.usersService.findOneUser(request.user.login);
        if (!user)
            throw common_1.BadRequestException;
        return {
            isTfaActivate: user.isTwoFA
        };
    }
    async turnOffTFAuthentication(request, body) {
        return await this.usersService.turnOffTwoFA(request.user.login);
    }
    async authenticate(req, { twoFA }, response) {
        const user = await this.usersService.findOneUser(req.user.login);
        if (!user)
            throw new common_1.BadRequestException();
        const isCodeValid = await this.twoFAService.isTwoFACodeValid(twoFA, user);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        response.cookie(`${constants_1.jwtConstants.twofa_jwt_name}`, null, {
            maxAge: 5000,
            httpOnly: true,
            sameSite: 'strict',
        });
        return await this.authService.login(user, response);
    }
    async authenticateFirst(req, { twoFA }, response) {
        const user = await this.usersService.findOneUser(req.user.login);
        if (!user)
            throw new common_1.BadRequestException();
        const isCodeValid = await this.twoFAService.isTwoFACodeValid(twoFA, user);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        return await this.usersService.turnOnTwoFA(user.login);
    }
    async checkToken(req) {
        const { sub, login } = req.user.login;
        return {
            login: login,
            id: sub
        };
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('activate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "isActivate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('turn-off'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "turnOffTFAuthentication", null);
__decorate([
    (0, common_1.UseGuards)(_2fa_jwt_auth_guard_1.TwoFAJwtAuthGuard),
    (0, common_1.Post)('authenticate'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "authenticate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('authenticate-first'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "authenticateFirst", null);
__decorate([
    (0, common_1.UseGuards)(_2fa_jwt_auth_guard_1.TwoFAJwtAuthGuard),
    (0, common_1.Get)('authorisation'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "checkToken", null);
TwofaController = __decorate([
    (0, common_1.Controller)('2fa'),
    __metadata("design:paramtypes", [twofa_service_1.TwoFAService,
        users_service_1.UsersService,
        auth_service_1.AuthService])
], TwofaController);
exports.TwofaController = TwofaController;
//# sourceMappingURL=twofa.controller.js.map