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
exports.TwoFAService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const qrcode_1 = require("qrcode");
const otplib_1 = require("otplib");
let TwoFAService = class TwoFAService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async isTwoFACodeValid(twoFACode, user) {
        return otplib_1.authenticator.verify({
            token: twoFACode,
            secret: user.twoFA,
        });
    }
    async generateTwoFASecret(login) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(login, `${process.env.TWOFA}`, secret);
        await this.usersService.setTwoFASecret(secret, login);
        return {
            secret,
            otpauthUrl
        };
    }
    async QrCode(stream, otpauthUrl) {
        return (0, qrcode_1.toFileStream)(stream, otpauthUrl, {
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
    }
};
TwoFAService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], TwoFAService);
exports.TwoFAService = TwoFAService;
//# sourceMappingURL=twofa.service.js.map