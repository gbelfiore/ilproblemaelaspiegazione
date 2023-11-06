import { IDay } from "@/types/types";
import clientDB from "./clientDB";

const getAllDay = async (): Promise<{ data: Array<IDay>, error: any }> => {
    const result = await clientDB.from("day").select("*");
    return { data: result.data as Array<IDay>, error: result.error }
}

const insertDay = async (day: IDay): Promise<{ data: Array<IDay>, error: any }> => {
    const now = new Date()
    const startTime = `${now.getHours()}:${now.getMinutes()}:00`;
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const result = await clientDB.from('day').insert([{ name: day.name, startTime, date }]).select("*")
    return { data: result.data as Array<IDay>, error: result.error }
}

const deleteDay = async (id: number): Promise<boolean> => {
    const result = await clientDB.from('day').delete().eq('id', id)
    return !result.error
}

const editDay = async (day: IDay): Promise<{ data: Array<IDay>, error: any }> => {
    const result = await clientDB.from('day').update(day).eq('id', day.id).select()
    return { data: result.data as Array<IDay>, error: result.error }
}

export { getAllDay, insertDay, deleteDay, editDay }