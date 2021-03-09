
import dayjs from 'dayjs';
let toDate = (value) => {
    return dayjs(value).format('YYYY年MM月DD日 HH:mm:ss');
}
let toDay = (value) => {
    return dayjs(value).format('YYYY.MM.DD');
}
export { toDate, toDay }