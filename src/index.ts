import 'dotenv/config';
import { httpServer } from './http_server';
import { startWS } from './server/server';

try {
    httpServer.listen(process.env.HTTP_PORT, () => {
        console.log(`HTTP server running on http://localhost:${process.env.HTTP_PORT}`);
    });

    startWS();
} catch (err) {
    console.error(`Ops... ${err}`);
}
