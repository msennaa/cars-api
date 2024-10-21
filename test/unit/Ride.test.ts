import Account from '../../src/domain/entity/Account';
import Position from '../../src/domain/entity/Position';
import Ride from '../../src/domain/entity/Ride'

test('Should not create a ride with invalid coordinate', function () {
    expect(() => Ride.create('', -180, 180, -180, 180)).toThrowError('Invalid latitude');
})

test('Should calculate ride distance', function () {
    const ride = Ride.create('', 0, 0, 0, 0);
    const account = Account.create('any name', 'any_email@mail.com', '97456321558', 'AAA9999', false, true);
    ride.accept(account);
    ride.start();
    const lastPosition = Position.create('', -27.584905257808835, -48.545022195325124)
    const currentPosition = Position.create('', -27.496887588317275, -48.522234807851476)
    ride.updatePosition(lastPosition, currentPosition);
    expect(ride.distance).toBe(10);
})
