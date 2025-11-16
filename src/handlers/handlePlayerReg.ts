import { IPlayer } from '../db/db';
import { IRegResponce, IWebsocket, WS_COMMAND } from '../types/types';
import { IVerifyOrCreatePlayerReturn, verifyOrCreatePlayer } from '../utils/utils';

const handlePlayerReg = (ws: IWebsocket, player: Omit<IPlayer, 'index' | 'wins' | 'ws'>) => {
    const result: IVerifyOrCreatePlayerReturn = verifyOrCreatePlayer(ws, player);
    const dataJSON = JSON.stringify({
        name: player.name || '',
        index: result.index || '',
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
