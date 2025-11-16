import { randomUUID } from 'crypto';
import { DB, findIndexRoomById, findPlayerById, findPlayerBySocket, IPlayer } from '../db/db';
import { wss } from '../server/server';
import { IGamePlayer, IWebsocket, WS_COMMAND } from '../types/types';
import { handleUpdateRooms } from './handleCreateRoom';

const handleAddPlayerToRoom = (ws: IWebsocket, data: string) => {
    const info = JSON.parse(data);
    const currentUser = findPlayerBySocket(ws.id);
    const selectedRoomIndex = findIndexRoomById(info.indexRoom);
    if (
        selectedRoomIndex !== -1 &&
        DB.rooms[selectedRoomIndex].roomUsers.length === 1 &&
        DB.rooms[selectedRoomIndex].roomUsers[0].index !== currentUser?.index
    ) {
        DB.rooms[selectedRoomIndex].roomUsers.push({
            name: currentUser?.name || '',
            index: currentUser?.index || '',
        });
        wss.clients.forEach((client) => {
            handleUpdateRooms(client as IWebsocket);
        });
        createGame(DB.rooms[selectedRoomIndex].roomUsers);
    }
};

const createGame = (rooms: Omit<IPlayer, 'wins' | 'password' | 'socket'>[]) => {
    const gameId = randomUUID();
    rooms.forEach((room) => {
        const player = findPlayerById(room.index);
        const gameData: IGamePlayer = {
            idGame: gameId,
            idPlayer: randomUUID(),
        };
        const response = {
            type: WS_COMMAND.CREATE_GAME,
            data: JSON.stringify(gameData),
            id: 0,
        };
        player?.socket.send(JSON.stringify(response));
    });
};

export { handleAddPlayerToRoom };
