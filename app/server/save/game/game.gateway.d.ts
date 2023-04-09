import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { ClientPayload } from './game.types';
import { GameAlgo } from "./game.algo";
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    constructor(gameService: GameService);
    server: Server;
    gameMap: Map<string, GameAlgo>;
    matchMaker(client: Socket, clientPayload: ClientPayload): Promise<void>;
    runingGamesList(): Promise<void>;
    addWatcherToGame(client: Socket, gameId: string): Promise<void>;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): void;
}
