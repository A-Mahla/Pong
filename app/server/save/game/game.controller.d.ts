import { GameService } from './game.service';
import { matchHistoryPayload } from './game.types';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    registerNewGame(): Promise<import(".prisma/client").Games>;
    registerNewPlayer(game_id: number, user: any): Promise<import(".prisma/client").User_Game>;
    getGameWaitingList(): Promise<import(".prisma/client").Games[]>;
    getGameHistory(req: any): Promise<{
        history: matchHistoryPayload[];
    }>;
    getnbGames(user_id: number): Promise<number>;
    getnbVictory(user_id: number): Promise<number>;
    getnbLoss(user_id: number): Promise<number>;
    createNewGameFull(players: any): Promise<void>;
}
