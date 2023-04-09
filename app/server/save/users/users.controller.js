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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const platform_express_1 = require("@nestjs/platform-express");
const User_dto_1 = require("./User.dto");
const users_service_1 = require("./users.service");
const local_auth_guard_1 = require("../auth/local-auth.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const rooms_service_1 = require("../chat/rooms/rooms.service");
const fs = require("fs");
const friends_service_1 = require("../chat/friends/friends.service");
let UsersController = class UsersController {
    constructor(userService, roomService, friendService) {
        this.userService = userService;
        this.roomService = roomService;
        this.friendService = friendService;
    }
    async handleLogin(query) {
        return await this.userService.findOneUser(query.login);
    }
    async getIntraUser(query) {
        return await this.userService.findOneIntraUser(query.intraLogin);
    }
    async handleSearchLogin(login) {
        return await this.userService.searchManyUsers(login);
    }
    async pong() {
        return;
    }
    async checkAvatar(req, file) {
        return this.userService.updateAvatar(req.user.login, file.filename);
    }
    async deletePicture(req) {
        const user = await this.userService.findOneUser(req.user.login);
        if (!user || !user.avatar) {
            throw new common_1.BadRequestException;
        }
        await this.userService.updateUser(user.login, { avatar: '' });
        if (user.avatar === 'alorain.jpg'
            || user.avatar === 'amahla.JPG'
            || user.avatar === 'slahlou.JPG')
            return;
        await fs.unlink(`./src/avatar/${user.avatar}`, (err) => {
            if (err) {
                console.error(err);
                return err;
            }
        });
    }
    async getFile(res, req) {
        try {
            const user = await this.userService.findOneUser(req.user.login);
            if (!user) {
                throw new common_1.BadRequestException;
            }
            if (!user.avatar) {
                res.status(204);
                return;
            }
            const file = (0, fs_1.createReadStream)((0, path_1.join)('./src/avatar/', user.avatar));
            return new common_1.StreamableFile(file);
        }
        catch (error) {
            throw new common_1.BadRequestException;
        }
    }
    async getFileOther(res, avatar) {
        const file = (0, fs_1.createReadStream)((0, path_1.join)('./src/avatar/', avatar));
        return new common_1.StreamableFile(file);
    }
    async changePassword(req, updateUserPass) {
        return this.userService.updatePass(req.user.login, updateUserPass);
    }
    async getProfileAuth(req) {
        return this.userService.getProfileAuth(parseInt(req.user.sub));
    }
    async getProfileInfo(req) {
        return this.userService.getProfileInfo(parseInt(req.user.sub));
    }
    async getProfileOtherInfo(id) {
        return await this.userService.getProfileInfo(+id);
    }
    async updateUserById(login, updateUserDto) {
        await this.userService.updateUser(login, updateUserDto);
    }
    async updatePatchUserById(login, updateUserDto) {
        await this.userService.updateUser(login, updateUserDto);
    }
    async getRooms(req) {
        console.log('user in request getRooms: ', req.user);
        return this.userService.findAllUserRooms(req.user.sub);
    }
};
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "handleLogin", null);
__decorate([
    (0, common_1.Get)('intra'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getIntraUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search/:login'),
    __param(0, (0, common_1.Param)('login')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "handleSearchLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(200),
    (0, common_1.Get)('profile/pong'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "pong", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('profile/avatar/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './src/avatar',
        })
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkAvatar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('profile/avatar/delete'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deletePicture", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile/avatar'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile/avatar/download/:avatar'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Param)('avatar')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFileOther", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('profile/pass'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, User_dto_1.UpdateUserDtoPass]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile/auth'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfileAuth", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile/info'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfileInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile/info/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfileOtherInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':login'),
    __param(0, (0, common_1.Param)('login')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':login'),
    __param(0, (0, common_1.Param)('login')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePatchUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('rooms'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRooms", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        rooms_service_1.RoomsService,
        friends_service_1.FriendsService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map