interface IDB {
    players: IPlayer[];
}

interface IPlayer {
    id: string;
    name: string;
    password: string;
    wins: number;
}

const DB: IDB = {
    players: [],
};

const addPlayer = (player: IPlayer) => {
    DB.players.push(player);
};

export { IDB, IPlayer, DB, addPlayer };
