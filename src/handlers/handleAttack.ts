import { findGameById } from '../db/db';
import {
    IAttackReq,
    IAttackResData,
    IGamePlayerData,
    shipStatus,
    WS_COMMAND,
    IPosition,
    IShip,
} from '../types/types';

const handleAttack = (data: string) => {
    const info: IAttackReq = JSON.parse(data);
    const game = findGameById(info.gameId);
    if (!game) return;

    const attackPlayer = game.players.find((player) => player.indexPlayer === info.indexPlayer);
    const enemy = game.players.find((player) => player.indexPlayer !== info.indexPlayer);
    if (!attackPlayer || !enemy) return;

    const alreadyAttacked = attackPlayer.attackedCells.some(
        (cell) => cell.x === info.x && cell.y === info.y,
    );
    if (alreadyAttacked) return;

    attackPlayer.attackedCells.push({ x: info.x, y: info.y });

    let status: shipStatus = 'miss';
    let killedShip: IShip | null = null;

    for (const ship of enemy.ships) {
        if (!ship.direction) {
            if (
                ship.position.y === info.y &&
                info.x >= ship.position.x &&
                info.x < ship.position.x + ship.length
            ) {
                ship.hits++;
                status = ship.hits === ship.length ? 'killed' : 'shot';
                if (status === 'killed') killedShip = ship;
                break;
            }
        } else {
            if (
                ship.position.x === info.x &&
                info.y >= ship.position.y &&
                info.y < ship.position.y + ship.length
            ) {
                ship.hits++;
                status = ship.hits === ship.length ? 'killed' : 'shot';
                if (status === 'killed') killedShip = ship;
                break;
            }
        }
    }
    sendAttackRes(attackPlayer, enemy, status, { x: info.x, y: info.y });
    if (killedShip) {
        const missCells = getAroundCells(killedShip);
        missCells.forEach((cell) => {
            sendAttackRes(attackPlayer, enemy, 'miss', cell);
        });
    }
};

const sendAttackRes = (
    attackPlayer: IGamePlayerData,
    enemy: IGamePlayerData,
    status: shipStatus,
    position: IPosition,
) => {
    const resData: IAttackResData = {
        position,
        currentPlayer: attackPlayer?.indexPlayer || '',
        status,
    };
    attackPlayer?.socket.send(
        JSON.stringify({
            type: WS_COMMAND.ATTACK,
            data: JSON.stringify(resData),
            id: 0,
        }),
    );
    enemy?.socket.send(
        JSON.stringify({
            type: WS_COMMAND.ATTACK,
            data: JSON.stringify(resData),
            id: 0,
        }),
    );
};

const getAroundCells = (ship: IShip) => {
    const cells: IPosition[] = [];
    let minX, maxX, minY, maxY;
    if (!ship.direction) {
        minX = ship.position.x - 1;
        maxX = ship.position.x + ship.length;
        minY = ship.position.y - 1;
        maxY = ship.position.y + 1;
    } else {
        minX = ship.position.x - 1;
        maxX = ship.position.x + 1;
        minY = ship.position.y - 1;
        maxY = ship.position.y + ship.length;
    }
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (!ship.direction) {
                if (
                    !(
                        ship.position.x <= x &&
                        ship.position.x + ship.length > x &&
                        ship.position.y === y
                    ) &&
                    x >= 0 &&
                    x < 10 &&
                    y >= 0 &&
                    y < 10
                ) {
                    cells.push({ x, y });
                }
            } else {
                if (
                    !(
                        ship.position.y <= y &&
                        ship.position.y + ship.length > y &&
                        ship.position.x === x
                    ) &&
                    x >= 0 &&
                    x < 10 &&
                    y >= 0 &&
                    y < 10
                ) {
                    cells.push({ x, y });
                }
            }
        }
    }
    return cells;
};

export { handleAttack };
