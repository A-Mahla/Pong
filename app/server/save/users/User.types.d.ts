export declare class CreateUserParams {
    login: string;
    password: string;
    avatar?: string;
    intraLogin?: string;
}
export declare class UpdateUserParams {
    login?: string;
    password?: string;
    avatar?: string;
    intraLogin?: string;
    twoFA?: string;
    isTwoFA?: boolean;
}
export declare class UpdateUserPass {
    password: string;
}
export declare class profile {
    login: string;
    avatar: string;
    win: number;
    loose: number;
    nbGames: number;
    status: string;
}
