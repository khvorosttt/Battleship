import { randomUUID } from 'crypto';
import { addPlayer, DB, findPlayerBySocket, IPlayer, selectWinsInfo } from '../db/db';
import { IGamePlayerData, IShip, IWebsocket, WS_COMMAND } from '../types/types';
import { wss } from '../server/server';

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

const isFinish = (ships: IShip[]) => {
    return ships.every((ship) => ship.hits === ship.length);
};

const updateWinners = (player: IGamePlayerData) => {
    const playerGlobal = findPlayerBySocket(player.socket.id);
    if (!playerGlobal) return;
    playerGlobal.wins++;
    const winsInfo = selectWinsInfo();
    const response = {
        type: WS_COMMAND.UPDATE_WINNERS,
        data: JSON.stringify(winsInfo),
        id: 0,
    };
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(response));
    });
};

export {
    verifyOrCreatePlayer,
    IVerifyOrCreatePlayerReturn,
    generateFreeCells,
    isFinish,
    updateWinners,
};
