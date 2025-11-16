import { DB } from '../db/db';
import { IGamePlayerData, IWebsocket, WS_COMMAND } from '../types/types';

const handleAddShips = (ws: IWebsocket, data: string) => {
    const gameInfo: IGamePlayerData = JSON.parse(data);
    gameInfo.socket = ws;
    console.log(gameInfo);
    const currentGameSessionIndex = DB.games.findIndex((game) => game.gameId === gameInfo.gameId);
    if (currentGameSessionIndex !== -1 && DB.games[currentGameSessionIndex].players.length < 2) {
        DB.games[currentGameSessionIndex].players.push(gameInfo);
        if (DB.games[currentGameSessionIndex].players.length === 2) {
            console.log('game start');
            handleStartGame(gameInfo);
        }
    } else {
        DB.games.push({
            gameId: gameInfo.gameId,
            players: [gameInfo],
        });
    }
};

const handleStartGame = (gameInfo: IGamePlayerData) => {
    const game = DB.games.find((g) => g.gameId === gameInfo.gameId);
    if (!game) return;
    game.players.forEach((player) => {
        const responseData = {
            ships: player.ships,
            currentPlayerIndex: gameInfo.indexPlayer,
        };
        const response = {
            type: WS_COMMAND.START_GAME,
            data: JSON.stringify(responseData),
            id: 0,
        };
        player.socket.send(JSON.stringify(response));
    });
};

export { handleAddShips };
