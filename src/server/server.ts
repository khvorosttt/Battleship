import 'dotenv/config';
import { WebSocketServer } from 'ws';
import { IWebsocket, WS_COMMAND } from '../types/types';
import { handlePlayerReg } from '../handlers/handlePlayerReg';
import { randomUUID } from 'crypto';
import { handleCreateRoom, handleUpdateRooms } from '../handlers/handleCreateRoom';
import { handleAddPlayerToRoom } from '../handlers/handleAddPlayerToRoom';

export const wss = new WebSocketServer({ port: Number(process.env.WS_PORT || '3000') });
const startWS = () => {
    wss.on('connection', function connection(ws: IWebsocket) {
        console.log('ws connected');
        ws.id = randomUUID();

        ws.on('message', (msg) => {
            const info = JSON.parse(msg.toString());
            const type = info.type;
            switch (type) {
                case WS_COMMAND.REGISTRATION:
                    console.log('registr');
                    handlePlayerReg(ws, JSON.parse(info.data));
                    handleUpdateRooms(ws);
                    break;
                case WS_COMMAND.CREATE_ROOM:
                    console.log('create room');
                    handleCreateRoom(ws);
                    break;
                case WS_COMMAND.ADD_USER_TO_ROOM:
                    console.log('add user to room');
                    handleAddPlayerToRoom(ws, info.data);
            }
            console.log(JSON.parse(msg.toString()));
        });

        ws.on('error', console.error);
    });

    wss.on('listening', () => {
        console.log('WebSocket starting');
        console.log('Waiting...');
    });

    return wss;
};

export { startWS };
