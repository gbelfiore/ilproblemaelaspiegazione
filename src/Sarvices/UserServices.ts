import clientDB from "./clientDB";
import { IUser } from "@/types/types";

const getAllUser = async (): Promise<{ data: Array<IUser>, error: any }> => {
    const result = await clientDB.from("user").select("*");
    return { data: result.data as Array<IUser>, error: result.error }
}

const insertUser = async (user: IUser): Promise<{ data: Array<IUser>, error: any }> => {
    const result = await clientDB.from('user').insert([{ name: user.name, surname: user.surname }]).select("*")
    return { data: result.data as Array<IUser>, error: result.error }
}

const deleteUser = async (id: number): Promise<boolean> => {
    const result = await clientDB.from('user').delete().eq('id', id)
    return !result.error
}

const editUser = async (user: IUser): Promise<{ data: Array<IUser>, error: any }> => {
    const result = await clientDB.from('user').update(user).eq('id', user.id).select()
    return { data: result.data as Array<IUser>, error: result.error }
}

export { getAllUser, insertUser, deleteUser, editUser }