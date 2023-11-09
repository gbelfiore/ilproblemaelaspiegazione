interface IUser {
    id: number;
    name: string;
    surname: string;
    userDay?: Array<IUserDay>
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
    userDay?: Array<IUserDay>
}

interface IUserDay {
    id: number;
    userId: number;
    dayId: number;
    moneyIn: number;
    moneyOut: number;
    timeIn: string;
    timeOut: string;
    rakeShare: number;
    user?: IUser;
    day?: IDay;
}

export type { IUser, IUserLogin, IDay, IUserDay }