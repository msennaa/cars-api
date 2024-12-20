import Position from '../../src/domain/entity/Position';
import Ride from '../../src/domain/entity/Ride'

test('Should not create a ride with invalid coordinate', function () {
    expect(() => Ride.create('', -180, 180, -180, 180)).toThrowError('Invalid latitude');
})

test('Should calculate ride distance', function () {
    const ride = Ride.create('', 0, 0, 0, 0);
    const account = { name: 'any name', email: 'any_email@mail.com', cpf: '97456321558', carPlate: 'AAA9999', isPassenger: false, isDriver: true };
    ride.accept(account);
    ride.start();
    const lastPosition = Position.create('', -27.584905257808835, -48.545022195325124)
    const currentPosition = Position.create('', -27.496887588317275, -48.522234807851476)
    ride.updatePosition(lastPosition, currentPosition);
    expect(ride.distance).toBe(10);
})
