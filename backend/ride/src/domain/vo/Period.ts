export default class Period {
    constructor(readonly start: Date, readonly end: Date) {
        if (start.getTime() > end.getTime()) throw new Error('Invalid Period');
    }

    calculateDifferenceInMilliseconds() {
        return this.end.getTime() - this.start.getTime();
    }
}
