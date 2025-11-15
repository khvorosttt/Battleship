import WebSocket from 'ws';

interface IRegResponce {
    type: string;
    data: string;
    id: 0;
}

interface IRegDataResponce {
    name: string;
    index: string;
    error: boolean;
    errorText: string;
}

interface IWebsocket extends WebSocket {
    id: string;
    playerName: string;
}

interface IGamePlayer {
    idGame: string;
    idPlayer: string;
}

enum WS_COMMAND {
    REGISTRATION = 'reg',
    CREATE_ROOM = 'create_room',
    UPDATE_ROOM = 'update_room',
    ADD_USER_TO_ROOM = 'add_user_to_room',
    CREATE_GAME = 'create_game',
}

export { WS_COMMAND, IRegResponce, IRegDataResponce, IWebsocket, IGamePlayer };
