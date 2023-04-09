import { Socket } from "socket.io";
export interface GamePatron {
    countDownRequired: boolean;
    canvasHeight: number;
    canvasWidth: number;
    playerHeight: number;
    playerWidth: number;
}
export declare const gamePatron: GamePatron;
export interface RoomInfo {
    roomId: string;
}
export type Player = {
    id: number;
    login: string;
    playerRole: "p1" | "p2";
    playerSocket: Socket;
    socketID: string;
};
export type ClientPayload = {
    id: string;
    login: string;
};
export type GameDataType = {
    roomInfo: {
        timer: number;
        countDown: number;
    };
    player1: {
        login: string;
        y: number;
        score: number;
        timeout: number;
    };
    player2: {
        login: string;
        y: number;
        score: number;
        timeout: number;
    };
    ball: {
        x: number;
        y: number;
        r: number;
        speed: {
            x: number;
            y: number;
        };
    };
};
export declare enum Status {
    EMPTY = 0,
    LOCKED = 1,
    ONE_PLAYER = 2,
    TWO_PLAYER = 3,
    RUNNING = 4,
    OVER = 5
}
export type matchHistoryPayload = {
    index: number;
    l1: string;
    a1: string;
    s1: number;
    l2: string;
    a2: string;
    s2: number;
};
