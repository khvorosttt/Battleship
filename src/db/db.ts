import { IGameSession, IWebsocket } from '../types/types';
interface IDB {
    players: IPlayer[];
    rooms: IRoom[];
    games: IGameSession[];
}

interface IPlayer {
    index: string;
    name: string;
    password: string;
    wins: number;
    socket: IWebsocket;
}

interface IRoom {
    roomId: string;
    roomUsers: Omit<IPlayer, 'wins' | 'password' | 'socket'>[];
}

const DB: IDB = {
    players: [],
    rooms: [],
    games: [],
};

const addPlayer = (player: IPlayer) => {
    DB.players.push(player);
};

const addRoom = (room: IRoom) => {
    DB.rooms.push(room);
};

const findPlayerBySocket = (wsId: string) => {
    return DB.players.find((player) => player.socket.id === wsId);
};

const findPlayerById = (id: string) => {
    return DB.players.find((player) => player.index === id);
};

const availableRooms = (index: string) => {
    return DB.rooms.filter((room) => !room.roomUsers.some((player) => player.index === index));
};

const findIndexRoomById = (roomId: string) => {
    return DB.rooms.findIndex((room) => room.roomId === roomId);
};

const findGameById = (id: string) => {
    return DB.games.find((g) => g.gameId === id);
};

const selectWinsInfo = () => {
    return DB.players.map((player) => {
        return {
            name: player.name,
            wins: player.wins,
        };
    });
};

export {
    IDB,
    IPlayer,
    DB,
    addPlayer,
    IRoom,
    addRoom,
    findPlayerBySocket,
    availableRooms,
    findIndexRoomById,
    findPlayerById,
    findGameById,
    selectWinsInfo,
};
