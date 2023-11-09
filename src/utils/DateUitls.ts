import moment from "moment";

const TOTAL_FORMAT = "DD-MM-YYYY HH:mm";
const DAY_FORMAT = "DD-MM-YYYY";
const HOURS_FORMAT = "HH:mm";

const formatData = (data: string, format?: string) => {
    format = format || TOTAL_FORMAT
    return moment(data).format(format)
}

const formatDay = (data: string) => {
    return moment(data).format(DAY_FORMAT)
}

const formatHours = (data: string) => {
    return moment(data).format(HOURS_FORMAT)
}


export { formatData, formatDay, formatHours }