import AccountGateway from '../../src/application/gateway/AccountGateway';
import AcceptRide from '../../src/application/usecase/ride/AcceptRide';
import GetRide from '../../src/application/usecase/ride/GetRide';
import RequestRide from '../../src/application/usecase/ride/RequestRide';
import StartRide from '../../src/application/usecase/ride/StartRide';
import UpdatePosition from '../../src/application/usecase/ride/UpdatePosition';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp';
import { AxiosAdapter } from '../../src/infra/http/HttpClient';
import PositionRepositoryDatabase from '../../src/infra/repository/PositionRepositoryDatabase';
import RideRepositoryDatabase from '../../src/infra/repository/RideRepositoryDatabase';

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let accountGateway: AccountGateway;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);
    const httpClient = new AxiosAdapter();
    accountGateway = new AccountGatewayHttp(httpClient);
    requestRide = new RequestRide(rideRepository, accountGateway);
    getRide = new GetRide(rideRepository, positionRepository, accountGateway);
    acceptRide = new AcceptRide(rideRepository, accountGateway);
    startRide = new StartRide(rideRepository);
    updatePosition = new UpdatePosition(rideRepository, positionRepository);
})

test('Should update position from a ride during day', async function () {
    const inputPassenger = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const outputSignupPassenger = await accountGateway.signup(inputPassenger)
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputDriver = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        carPlate: 'AAA9999',
        isDriver: true
    }
    const outputSignupDriver = await accountGateway.signup(inputDriver)
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    }
    await acceptRide.execute(inputAcceptRide)
    const inputStartRide = {
        rideId: outputRequestRide.rideId,
    }
    await startRide.execute(inputStartRide);
    const firstUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
        date: new Date('2023-03-01T10:00:00')
    }

    const secondUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476,
        date: new Date('2023-03-01T10:10:00')
    }
    await updatePosition.execute(firstUpdatePosition);
    await updatePosition.execute(secondUpdatePosition);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.currentLat).toBe(-27.496887588317275);
    expect(outputGetRide.currentLong).toBe(-48.522234807851476);
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(21);
})

test('Should update position from a ride during the night', async function () {
    const inputPassenger = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const outputSignupPassenger = await accountGateway.signup(inputPassenger)
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputDriver = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        carPlate: 'AAA9999',
        isDriver: true
    }
    const outputSignupDriver = await accountGateway.signup(inputDriver)
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    }
    await acceptRide.execute(inputAcceptRide)
    const inputStartRide = {
        rideId: outputRequestRide.rideId,
    }
    await startRide.execute(inputStartRide);
    const firstUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
        date: new Date('2023-03-01T23:00:00')
    }

    const secondUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476,
        date: new Date('2023-03-01T23:10:00')
    }
    await updatePosition.execute(firstUpdatePosition);
    await updatePosition.execute(secondUpdatePosition);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.currentLat).toBe(-27.496887588317275);
    expect(outputGetRide.currentLong).toBe(-48.522234807851476);
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(39);
})

test('Should update position from a ride on sunday', async function () {
    const inputPassenger = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const outputSignupPassenger = await accountGateway.signup(inputPassenger)
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    const inputDriver = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        carPlate: 'AAA9999',
        isDriver: true
    }
    const outputSignupDriver = await accountGateway.signup(inputDriver)
    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId,
    }
    await acceptRide.execute(inputAcceptRide)
    const inputStartRide = {
        rideId: outputRequestRide.rideId,
    }
    await startRide.execute(inputStartRide);
    const firstUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.584905257808835,
        long: -48.545022195325124,
        date: new Date('2021-03-07T10:00:00')
    }
    const secondUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476,
        date: new Date('2021-03-07T10:10:00')
    }
    await updatePosition.execute(firstUpdatePosition);
    await updatePosition.execute(secondUpdatePosition);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.currentLat).toBe(-27.496887588317275);
    expect(outputGetRide.currentLong).toBe(-48.522234807851476);
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.fare).toBe(50);
})

afterEach(async () => {
    await connection.close();
})
