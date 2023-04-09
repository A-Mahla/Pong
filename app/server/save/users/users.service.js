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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const game_service_1 = require("../game/game.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma, gameService) {
        this.prisma = prisma;
        this.gameService = gameService;
    }
    async findUsers() {
        return this.prisma.user.findMany();
    }
    async searchManyUsers(login) {
        return await this.prisma.user.findMany({
            where: {
                login: {
                    startsWith: login
                },
            },
            select: {
                id: true,
                login: true,
                avatar: true,
                password: false,
                isTwoFA: false,
                twoFA: false,
                refreshToken: false,
                intraLogin: false,
                updatedAt: false,
                createdAt: false,
            }
        });
    }
    async findIfExistUser(login) {
        return await this.prisma.user.count({
            where: { login: login }
        });
    }
    async findOneUser(login) {
        return await this.prisma.user.findUnique({
            where: { login: login }
        }).catch((e) => {
            throw new common_1.BadRequestException();
        });
    }
    async findUserById(id) {
        return await this.prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                ownedRooms: true,
                member: true
            }
        }).catch((e) => {
            throw new common_1.BadRequestException();
        });
    }
    async findOneIntraUser(intraLogin) {
        return this.prisma.user.findUnique({
            where: { intraLogin: intraLogin }
        }).catch((e) => {
            throw new common_1.BadRequestException();
        });
    }
    async updateUser(login, updateUserDetails) {
        return await this.prisma.user.update({
            where: { login: login },
            data: Object.assign({}, updateUserDetails)
        }).catch((e) => {
            throw new common_1.BadRequestException();
        });
    }
    async updateRefreshToken(login, refreshToken) {
        return await this.prisma.user.update({
            where: { login: login },
            data: { refreshToken: refreshToken }
        }).catch((e) => {
            throw new common_1.BadRequestException();
        });
    }
    async updateAvatar(login, avatar) {
        return await this.prisma.user.update({
            where: { login: login },
            data: { avatar: avatar }
        }).catch((e) => {
            throw new common_1.BadRequestException();
        });
    }
    async deleteUser(login) {
        return this.prisma.user.delete({
            where: { login: login }
        }).catch((e) => {
            throw new common_1.BadRequestException();
        });
    }
    async createUser(userDetails) {
        const newUser = Object.assign(Object.assign({}, userDetails), { createdAt: new Date(), password: await bcrypt.hash(userDetails.password, 12) });
        return this.prisma.user.create({
            data: Object.assign({}, newUser)
        }).catch((e) => {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    console.log('unique constraint violation');
                    throw new common_1.BadRequestException('login unavailable');
                }
            }
            throw new common_1.BadRequestException('');
        });
    }
    async setTwoFASecret(secret, login) {
        return await this.updateUser(login, {
            twoFA: secret
        });
    }
    async turnOnTwoFA(login) {
        return await this.updateUser(login, {
            isTwoFA: true,
        });
    }
    async turnOffTwoFA(login) {
        return await this.updateUser(login, {
            isTwoFA: false,
            twoFA: ''
        });
    }
    async updatePass(login, updateUserPass) {
        return await this.updateUser(login, { password: await bcrypt.hash(updateUserPass.password, 12) });
    }
    async getProfileAuth(user_id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: user_id
            },
            select: {
                login: true
            }
        });
        return {
            login: user === null || user === void 0 ? void 0 : user.login,
            id: user_id
        };
    }
    async getProfileInfo(user_id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: user_id
            },
            select: {
                login: true,
                avatar: true
            }
        });
        return {
            login: user === null || user === void 0 ? void 0 : user.login,
            avatar: user === null || user === void 0 ? void 0 : user.avatar,
            nbGames: (await this.gameService.getNbGames(user_id)),
            nbWin: (await this.gameService.getVictoryLossCountForUser(user_id, true)),
            nbLoss: (await this.gameService.getVictoryLossCountForUser(user_id, false)),
        };
    }
    async findAllUserRooms(id) {
        const userRooms = await this.prisma.user_Room.findMany({
            where: {
                member_id: id
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
        const userRoomsId = userRooms.map((value) => (value.room_id));
        const rooms = await this.prisma.room.findMany({
            where: {
                room_id: { in: userRoomsId }
            },
            include: {
                messages: true
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
        return rooms;
    }
    async joinRoom(userId, roomId) {
        const room_id = +roomId;
        return this.prisma.user_Room.create({
            data: {
                member_id: userId,
                room_id: room_id
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        game_service_1.GameService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map