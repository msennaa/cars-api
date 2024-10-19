export default class DateUtil {
    static calculateDifferenceInMilliseconds(start: Date, end: Date) {
        return end.getTime() - start.getTime();
    }
}
