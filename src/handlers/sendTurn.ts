import { IGameSession, WS_COMMAND } from '../types/types';

const sendTurn = (game: IGameSession, currentPlayer: string) => {
    const response = {
        type: WS_COMMAND.TURN,
        data: JSON.stringify({
            currentPlayer,
        }),
        id: 0,
    };
    game.players.forEach((player) => player.socket.send(JSON.stringify(response)));
};

export { sendTurn };
