import { randomUUID } from 'crypto';
import { addPlayer, DB, IPlayer } from '../db/db';
import { IWebsocket } from '../types/types';

interface IVerifyOrCreatePlayerReturn {
    error: boolean;
    index?: string;
    errorMSG?: string;
}

const verifyOrCreatePlayer = (
    ws: IWebsocket,
    data: Omit<IPlayer, 'index' | 'wins' | 'ws'>,
): IVerifyOrCreatePlayerReturn => {
    const existedPlayer = DB.players.find((player) => player.name === data.name);
    if (existedPlayer) {
        if (existedPlayer.password === data.password) {
            ws.playerName = data.name;
            return {
                index: existedPlayer.index,
                error: false,
            };
        } else {
            return {
                error: true,
                errorMSG: 'Invalid password',
            };
        }
    } else {
        ws.playerName = data.name;
        const newPlayer = {
            index: randomUUID(),
            ...data,
            wins: 0,
            socket: ws,
        };
        addPlayer(newPlayer);
        return {
            index: newPlayer.index,
            error: false,
        };
    }
};

const generateFreeCells = () => {
    return Array.from({ length: 100 }, (_, i) => ({
        x: i % 10,
        y: Math.floor(i / 10),
    }));
};

export { verifyOrCreatePlayer, IVerifyOrCreatePlayerReturn, generateFreeCells };
