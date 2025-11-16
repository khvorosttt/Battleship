import { findGameById } from '../db/db';
import { IAttackReq, IPosition } from '../types/types';
import { handleAttack } from './handleAttack';

const handleRandomAttack = (data: string) => {
    const info: Omit<IAttackReq, 'x' | 'y'> = JSON.parse(data);
    const game = findGameById(info.gameId);
    if (!game) return;

    const attackPlayer = game.players.find((player) => player.indexPlayer === info.indexPlayer);
    if (!attackPlayer) return;
    if (game.currentPlayerId !== attackPlayer.indexPlayer) return;
    if (attackPlayer.freeCells.length === 0) return;
    const randIndex = Math.floor(Math.random() * attackPlayer.freeCells.length);
    const position: IPosition = attackPlayer.freeCells[randIndex];
    attackPlayer.freeCells.splice(randIndex, 1);
    console.log(position);
    const response: IAttackReq = {
        gameId: game.gameId,
        x: position.x,
        y: position.y,
        indexPlayer: attackPlayer.indexPlayer,
    };
    handleAttack(JSON.stringify(response));
};

export { handleRandomAttack };
