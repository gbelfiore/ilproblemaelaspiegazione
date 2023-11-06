import { AuthTokenResponse } from "@supabase/supabase-js";
import clientDB from "./clientDB";
import { IUser, IUserLogin } from "@/types/types";

const getAllUser = async (): Promise<{ data: Array<IUser>, error: any }> => {
    const result = await clientDB.from("user").select("*, userDay(*)");
    return { data: result.data as Array<IUser>, error: result.error }
}

const getAllUserNotInGame = async (userInGame: Array<number>): Promise<{ data: Array<IUser>, error: any }> => {
    const result = await clientDB.from("user").select("*").not("id", "in", `(${userInGame.join(",")})`);
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
    const result = await clientDB.from('user').update({ name: user.name, surname: user.surname }).eq('id', user.id).select()
    return { data: result.data as Array<IUser>, error: result.error }
}

const loginUser = async (data: IUserLogin): Promise<AuthTokenResponse> => {
    const result = await clientDB.auth.signInWithPassword({ email: data.email, password: data.password })
    return result
}

export { getAllUser, getAllUserNotInGame, insertUser, deleteUser, editUser, loginUser }