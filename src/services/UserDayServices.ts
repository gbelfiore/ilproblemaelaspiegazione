import { IDay, IUserDay } from "@/types/types";
import clientDB from "./clientDB";



const addUserOnDay = async (userId: number, dayId: number, moneyIn: number, timeIn: string): Promise<{ data: Array<IUserDay>, error: any }> => {
    const result = await clientDB.from('userDay').insert([{ userId, dayId, moneyIn, timeIn }]).select("*, user(*)")
    return { data: result.data as Array<IUserDay>, error: result.error }
}


const updateMoneyIn = async (userDayId: number, moneyIn: number): Promise<{ data: IUserDay, error: any }> => {
    const result = await clientDB.from('userDay').update({ moneyIn }).eq('id', userDayId).select("*, user(*)")
    return { data: result.data?.[0] as IUserDay, error: result.error }
}

const updateMoneyOut = async (userDayId: number, moneyOut: number, timeOut: string): Promise<{ data: IUserDay, error: any }> => {
    const result = await clientDB.from('userDay').update({ moneyOut, timeOut }).eq('id', userDayId).select("*, user(*)")
    return { data: result.data?.[0] as IUserDay, error: result.error }
}

const updateShareRake = async (userDayId: number, rakeShare: number): Promise<{ data: IUserDay, error: any }> => {
    const result = await clientDB.from('userDay').update({ rakeShare }).eq('id', userDayId).select("*, user(*)")
    return { data: result.data?.[0] as IUserDay, error: result.error }
}




export { addUserOnDay, updateMoneyIn, updateMoneyOut, updateShareRake }