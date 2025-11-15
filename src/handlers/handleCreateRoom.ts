import { randomUUID } from 'crypto';
import { addRoom, DB, findPlayerBySocket, IRoom } from '../db/db';
import { IWebsocket, WS_COMMAND } from '../types/types';
import { wss } from '../server/server';

const handleCreateRoom = (ws: IWebsocket) => {
    const currentUser = findPlayerBySocket(ws.id);
    if (currentUser) {
        const newRoom: IRoom = {
            roomId: randomUUID(),
            roomUsers: [
                {
                    name: currentUser.name,
                    index: currentUser.index,
                },
            ],
        };
        addRoom(newRoom);
        wss.clients.forEach((client) => {
            handleUpdateRooms(client as IWebsocket);
        });
    }
};

const handleUpdateRooms = (ws: IWebsocket) => {
    const rooms = DB.rooms.filter(
        (room) => room.roomUsers.length === 1 && ws.playerName !== room.roomUsers[0].name,
    );
    const response = {
        type: WS_COMMAND.UPDATE_ROOM,
        data: JSON.stringify(rooms),
        id: 0,
    };
    ws.send(JSON.stringify(response));
};

export { handleCreateRoom, handleUpdateRooms };
