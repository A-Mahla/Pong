/// <reference types="multer" />
import { StreamableFile } from '@nestjs/common';
import { UpdateUserDto, UpdateUserDtoPass } from './User.dto';
import { UsersService } from './users.service';
import { Response } from "express";
import { RoomsService } from 'src/chat/rooms/rooms.service';
import { User } from '@prisma/client';
import { FriendsService } from 'src/chat/friends/friends.service';
export declare class UsersController {
    private userService;
    private roomService;
    private readonly friendService;
    constructor(userService: UsersService, roomService: RoomsService, friendService: FriendsService);
    handleLogin(query: {
        login: string;
        password: string;
    }): Promise<User | null>;
    getIntraUser(query: {
        intraLogin: string;
    }): Promise<User | null>;
    handleSearchLogin(login: string): Promise<{
        id: number;
        login: string;
        avatar: string | null;
    }[]>;
    pong(): Promise<void>;
    checkAvatar(req: any, file: Express.Multer.File): Promise<User>;
    deletePicture(req: any): Promise<void>;
    getFile(res: Response, req: any): Promise<StreamableFile | undefined>;
    getFileOther(res: Response, avatar: string): Promise<StreamableFile>;
    changePassword(req: any, updateUserPass: UpdateUserDtoPass): Promise<User>;
    getProfileAuth(req: any): Promise<{
        login: string | undefined;
        id: number;
    }>;
    getProfileInfo(req: any): Promise<{
        login: string | undefined;
        avatar: string | null | undefined;
        nbGames: number;
        nbWin: number;
        nbLoss: number;
    }>;
    getProfileOtherInfo(id: string): Promise<{
        login: string | undefined;
        avatar: string | null | undefined;
        nbGames: number;
        nbWin: number;
        nbLoss: number;
    }>;
    updateUserById(login: string, updateUserDto: UpdateUserDto): Promise<void>;
    updatePatchUserById(login: string, updateUserDto: UpdateUserDto): Promise<void>;
    getRooms(req: any): Promise<(import(".prisma/client").Room & {
        messages: import(".prisma/client").Message[];
    })[]>;
}
