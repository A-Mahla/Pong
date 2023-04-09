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
exports.TwoFATokenStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
const common_2 = require("@nestjs/common");
let TwoFATokenStrategy = class TwoFATokenStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'twofa') {
    constructor() {
        super({
            usernameField: 'login',
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([(request) => {
                    const data = request === null || request === void 0 ? void 0 : request.cookies[`${constants_1.jwtConstants.twofa_jwt_name}`];
                    if (!data) {
                        throw new common_2.BadRequestException();
                    }
                    return data;
                }]),
            secretOrKey: constants_1.jwtConstants.twofa_jwt_secret,
            ignoreExpiration: false
        });
    }
    validate(payload) {
        return payload;
    }
};
TwoFATokenStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TwoFATokenStrategy);
exports.TwoFATokenStrategy = TwoFATokenStrategy;
//# sourceMappingURL=2fa-jwt.strategy.js.map