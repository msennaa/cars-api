import Period from '../../src/domain/vo/Period';

test('Should calculate difference between two dates in milliseconds', function () {
    const start = new Date('2023-01-10T10:00:00')
    const end = new Date('2023-01-10T10:30:00')
    const period = new Period(start, end);
    const difference = period.calculateDifferenceInMilliseconds();
    expect(difference).toBe(1800000);
})
