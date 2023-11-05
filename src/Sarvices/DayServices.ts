import clientDB from "./clientDB";

const getAllDay = async () => {

    let data = await clientDB.from("day").select("*");
    return data

}

export { getAllDay }