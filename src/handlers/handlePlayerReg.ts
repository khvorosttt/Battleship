import { WebSocket } from 'ws';
import { IPlayer } from '../db/db';
import { IRegResponce, WS_COMMAND } from '../types/types';
import { IVerifyOrCreatePlayerReturn, verifyOrCreatePlayer } from '../utils/utils';

const handlePlayerReg = (ws: WebSocket, player: Omit<IPlayer, 'id' | 'wins'>) => {
    const result: IVerifyOrCreatePlayerReturn = verifyOrCreatePlayer(player);
    const dataJSON = JSON.stringify({
        name: player.name || '',
        index: result.id || '',
        error: result.error,
        errorText: result.errorMSG || '',
    });
    const response: IRegResponce = {
        type: WS_COMMAND.REGISTRATION,
        data: dataJSON,
        id: 0,
    };
    ws.send(JSON.stringify(response));
};

export { handlePlayerReg };
