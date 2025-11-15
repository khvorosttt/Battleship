import 'dotenv/config';
import { WebSocketServer } from 'ws';
import { WS_COMMAND } from '../types/types';
import { handlePlayerReg } from '../handlers/handlePlayerReg';

const startWS = () => {
    const wss = new WebSocketServer({ port: Number(process.env.WS_PORT || '3000') });

    wss.on('connection', function connection(ws) {
        console.log('ws connected');

        ws.on('message', (msg) => {
            const info = JSON.parse(msg.toString());
            const type = info.type;
            switch (type) {
                case WS_COMMAND.REGISTRATION:
                    console.log('registr');
                    handlePlayerReg(ws, JSON.parse(info.data));
            }
        });

        ws.on('error', console.error);
    });

    wss.on('listening', () => {
        console.log('WebSocket starting');
        console.log('Waiting...');
    });
};

export { startWS };
