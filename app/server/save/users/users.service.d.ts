import { PrismaService } from 'src/prisma/prisma.service';
import { User, Room } from '@prisma/client';
import { GameService } from 'src/game/game.service';
import { CreateUserParams, UpdateUserParams, UpdateUserPass } from './User.types';
export declare class UsersService {
    private prisma;
    private readonly gameService;
    constructor(prisma: PrismaService, gameService: GameService);
    findUsers(): Promise<User[]>;
    searchManyUsers(login: string): Promise<{
        id: number;
        login: string;
        avatar: string | null;
    }[]>;
    findIfExistUser(login: string): Promise<number>;
    findOneUser(login: string): Promise<User | null>;
    findUserById(id: number): Promise<User | null>;
    findOneIntraUser(intraLogin: string): Promise<User | null>;
    updateUser(login: string, updateUserDetails: UpdateUserParams): Promise<User>;
    updateRefreshToken(login: string, refreshToken: string): Promise<User>;
    updateAvatar(login: string, avatar: string): Promise<User>;
    deleteUser(login: string): Promise<User>;
    createUser(userDetails: CreateUserParams): Promise<User>;
    setTwoFASecret(secret: string, login: string): Promise<User>;
    turnOnTwoFA(login: string): Promise<User>;
    turnOffTwoFA(login: string): Promise<User>;
    updatePass(login: string, updateUserPass: UpdateUserPass): Promise<User>;
    getProfileAuth(user_id: number): Promise<{
        login: string | undefined;
        id: number;
    }>;
    getProfileInfo(user_id: number): Promise<{
        login: string | undefined;
        avatar: string | null | undefined;
        nbGames: number;
        nbWin: number;
        nbLoss: number;
    }>;
    findAllUserRooms(id: number): Promise<(Room & {
        messages: import(".prisma/client").Message[];
    })[]>;
    joinRoom(userId: number, roomId: number): Promise<import(".prisma/client").User_Room>;
}
