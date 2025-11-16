import { DB } from '../db/db';
import { IGamePlayerData, IWebsocket, ShipWithoutHits, WS_COMMAND } from '../types/types';
import { generateFreeCells } from '../utils/utils';
import { sendTurn } from './sendTurn';

const handleAddShips = (ws: IWebsocket, data: string) => {
    const gameInfo: Omit<IGamePlayerData, 'attackedCells'> = JSON.parse(data);
    gameInfo.socket = ws;
    gameInfo.ships.forEach((ship) => {
        ship.hits = 0;
    });
    const currentGameSessionIndex = DB.games.findIndex((game) => game.gameId === gameInfo.gameId);
    if (currentGameSessionIndex !== -1 && DB.games[currentGameSessionIndex].players.length < 2) {
        DB.games[currentGameSessionIndex].players.push({
            ...gameInfo,
            attackedCells: [],
            freeCells: generateFreeCells(),
        });
        if (DB.games[currentGameSessionIndex].players.length === 2) {
            DB.games[currentGameSessionIndex].currentPlayerId = gameInfo.indexPlayer;
            handleStartGame(gameInfo);
        }
    } else {
        DB.games.push({
            gameId: gameInfo.gameId,
            players: [
                {
                    ...gameInfo,
                    attackedCells: [],
                    freeCells: generateFreeCells(),
                },
            ],
            currentPlayerId: undefined,
        });
    }
};

const handleStartGame = (gameInfo: Omit<IGamePlayerData, 'attackedCells' | 'freeCells'>) => {
    const game = DB.games.find((g) => g.gameId === gameInfo.gameId);
    if (!game) return;
    game.players.forEach((player) => {
        const shipsWithoutHits: ShipWithoutHits[] = player.ships.map((ship) => ({
            position: ship.position,
            direction: ship.direction,
            type: ship.type,
            length: ship.length,
        }));
        const responseData = {
            ships: shipsWithoutHits,
            currentPlayerIndex: gameInfo.indexPlayer,
        };
        const response = {
            type: WS_COMMAND.START_GAME,
            data: JSON.stringify(responseData),
            id: 0,
        };
        player.socket.send(JSON.stringify(response));
    });
    sendTurn(game, game.players[1].indexPlayer);
};

export { handleAddShips };
