import Ride from '../../src/domain/Ride'

test('Should not create a ride with invalid coordinate', function () {
    expect(() => Ride.create('', -180, 180, -180, 180)).toThrowError('Invalid latitude');
})