export declare class CreateUserDto {
    login: string;
    password: string;
    intraLogin?: string;
    avatar?: string;
}
export declare class UpdateUserDtoPass {
    password: string;
}
export declare class UpdateUserDto {
    login?: string;
    password?: string;
    avatar?: string;
    intraLogin?: string;
    refreshToken?: string;
}
export declare class UserDto {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    login: string;
    password: string;
    avatar?: string;
    intraLogin?: string;
    refreshToken?: string;
}
export declare class numberFormat {
    id: number;
}
