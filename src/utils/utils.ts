import { randomUUID } from 'crypto';
import { addPlayer, DB, IPlayer } from '../db/db';

interface IVerifyOrCreatePlayerReturn {
    error: boolean;
    id?: string;
    errorMSG?: string;
}

const verifyOrCreatePlayer = (data: Omit<IPlayer, 'id' | 'wins'>): IVerifyOrCreatePlayerReturn => {
    const existedPlayer = DB.players.find((player) => player.name === data.name);
    if (existedPlayer) {
        if (existedPlayer.password === data.password) {
            return {
                id: existedPlayer.id,
                error: false,
            };
        } else {
            return {
                error: true,
                errorMSG: 'Invalid password',
            };
        }
    } else {
        const newPlayer = {
            id: randomUUID(),
            ...data,
            wins: 0,
        };
        addPlayer(newPlayer);
        return {
            id: newPlayer.id,
            error: false,
        };
    }
};

export { verifyOrCreatePlayer, IVerifyOrCreatePlayerReturn };
