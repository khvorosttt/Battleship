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
    ADD_SHIPS = 'add_ships',
    START_GAME = 'start_game',
    ATTACK = 'attack',
    TURN = 'turn',
    RANDOM_ATTACK = 'randomAttack',
}

type shipType = 'small' | 'medium' | 'large' | 'huge';

type shipStatus = 'miss' | 'killed' | 'shot';

interface IPosition {
    x: number;
    y: number;
}

type ShipWithoutHits = Omit<IShip, 'hits'>;

interface IShip {
    position: IPosition;
    direction: boolean;
    length: number;
    type: shipType;
    hits: number;
}

interface IGamePlayerData {
    gameId: string;
    ships: IShip[];
    indexPlayer: string;
    socket: IWebsocket;
    attackedCells: IPosition[];
    freeCells: IPosition[];
}

interface IGameSession {
    gameId: string;
    players: IGamePlayerData[];
    currentPlayerId: string | undefined;
}

interface IAttackReq {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: string;
}

interface IAttackResData {
    position: IPosition;
    currentPlayer: string;
    status: shipStatus;
}

export {
    WS_COMMAND,
    IRegResponce,
    IRegDataResponce,
    IWebsocket,
    IGamePlayer,
    shipType,
    IShip,
    IGameSession,
    IGamePlayerData,
    IAttackReq,
    ShipWithoutHits,
    shipStatus,
    IAttackResData,
    IPosition,
};
