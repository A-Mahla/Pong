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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const users_service_1 = require("../../users/users.service");
let RoomsService = class RoomsService {
    constructor(prisma, userService) {
        this.prisma = prisma;
        this.userService = userService;
    }
    async createRoom(roomDetails) {
        const newRoomData = {
            name: roomDetails.name,
            ownerId: roomDetails.owner_id,
            password: roomDetails.password
        };
        console.log('newRoomData: ', newRoomData);
        const newRoom = await this.prisma.room.create({
            data: Object.assign({}, newRoomData)
        }).catch((e) => { throw e; });
        await this.prisma.user_Room.create({
            data: {
                member_id: roomDetails.owner_id,
                room_id: newRoom.room_id
            }
        }).catch((e) => { throw new common_1.BadRequestException(e); });
        return newRoom;
    }
    async findAll() {
        return this.prisma.room.findMany({
            include: {
                members: true
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
    }
    async getRoomById(roomId) {
        const id = +roomId;
        return this.prisma.room.findUnique({
            where: {
                room_id: id
            },
            include: {
                messages: true
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
    }
    async getRoomOwner(roomId) {
        const room = await this.getRoomById(roomId);
        console.log(room);
        if (room === null)
            throw new common_1.BadRequestException('Invalid content', { cause: new Error(), description: 'invalid room id' });
        if (room.ownerId === null)
            throw new common_1.BadRequestException('Invalid content', { cause: new Error(), description: 'room dont have owner' });
        const user = await this.userService.findUserById(room.ownerId)
            .catch((e) => {
            throw new common_1.BadRequestException(e);
        });
        console.log(user);
        return user;
    }
    async findManyRooms(name) {
        const rooms = await this.prisma.room.findMany({
            where: {
                name: name
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
        return rooms;
    }
    async deleteRelation(userId, roomId) {
        return this.prisma.user_Room.delete({
            where: {
                member_id_room_id: {
                    member_id: userId,
                    room_id: roomId
                }
            }
        }).catch((e) => {
            throw new common_1.BadRequestException(e);
        });
    }
};
RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map