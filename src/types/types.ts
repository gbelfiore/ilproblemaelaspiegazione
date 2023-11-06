interface IUser {
    id: number;
    name: string;
    surname: string;
}

interface IUserLogin {
    email: string;
    password: string;
}

interface IDay {
    id: number;
    name: string;
    rake: number;
    startTime: string;
    endTime: string;
    date: string;
}

export type { IUser, IUserLogin, IDay }