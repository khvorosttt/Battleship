import 'dotenv/config';
import { WebSocketServer } from 'ws';

const startWS = () => {
    const wss = new WebSocketServer({ port: Number(process.env.WS_PORT || '3000') });

    wss.on('connection', function connection(ws) {
        console.log('ws connected');

        ws.on('message', (data) => {
            console.log(data.toString());
        });

        ws.send('sended msg');

        ws.on('error', console.error);
    });

    wss.on('listening', () => {
        console.log('WebSocket starting');
        console.log('Waiting...');
    });
};

export { startWS };
