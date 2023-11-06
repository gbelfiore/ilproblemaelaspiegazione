import { IDay } from "@/types/types";
import clientDB from "./clientDB";

const getAllDay = async (isClosed: boolean): Promise<{ data: Array<IDay>, error: any }> => {
    let query = clientDB.from("day").select("*, userDay(*)")
    if (isClosed) query.not("endTime", "is", "null")
    else query = query = query.is("endTime", "null")
    const result = await query
    return { data: result.data as Array<IDay>, error: result.error }
}

const getDayById = async (id: number): Promise<{ data: IDay, error: any }> => {
    const result = await clientDB.from("day").select("*, userDay(*, user(*))").eq("id", id)
    return { data: result.data?.[0] as IDay, error: result.error }
}

const insertDay = async (day: IDay): Promise<{ data: Array<IDay>, error: any }> => {
    const result = await clientDB.from('day').insert([{ name: day.name, startTime: day.startTime, date: day.date }]).select("*")
    return { data: result.data as Array<IDay>, error: result.error }
}

const deleteDay = async (id: number): Promise<boolean> => {
    const result = await clientDB.from('day').delete().eq('id', id)
    return !result.error
}

const editDay = async (day: IDay): Promise<{ data: Array<IDay>, error: any }> => {
    const result = await clientDB.from('day').update({ name: day.name, startTime: day.startTime, date: day.date }).eq('id', day.id).select()
    return { data: result.data as Array<IDay>, error: result.error }
}

export { getAllDay, getDayById, insertDay, deleteDay, editDay }