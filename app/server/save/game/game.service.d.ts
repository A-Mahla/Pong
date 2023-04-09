import { PrismaService } from 'src/prisma/prisma.service';
import { GameDataType, Player, matchHistoryPayload } from './game.types';
export declare class GameService {
    private prisma;
    constructor(prisma: PrismaService);
    endGameDBwrites(gameID: string, player1: Player, player2: Player, gameData: GameDataType): Promise<void>;
    registerNewGame(status: string): Promise<import(".prisma/client").Games>;
    registerNewPlayer(game_id: number, user_id: number, score: number): Promise<import(".prisma/client").User_Game>;
    checkPlayerInGame(game_id: number): Promise<number>;
    gamesbyStatus(statusTofind: string): Promise<import(".prisma/client").Games[]>;
    gameHistory(userId: number): Promise<(import(".prisma/client").User_Game & {
        game: import(".prisma/client").Games & {
            players: (import(".prisma/client").User_Game & {
                player: import(".prisma/client").User;
            })[];
        };
    })[]>;
    parseGameHistory(raw: any): {
        history: matchHistoryPayload[];
    };
    getVictoryLossCountForUser(userId: number, InfSup: boolean): Promise<number>;
    getNbGames(user_id: number): Promise<number>;
    updateGamestatus(game_id: number, status: string): Promise<import(".prisma/client").Games>;
}
