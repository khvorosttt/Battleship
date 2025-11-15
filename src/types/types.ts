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

enum WS_COMMAND {
    REGISTRATION = 'reg',
}

export { WS_COMMAND, IRegResponce, IRegDataResponce };
