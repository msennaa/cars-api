import AccountGateway from '../../src/application/gateway/AccountGateway';
import AcceptRide from '../../src/application/usecase/ride/AcceptRide';
import GetRide from '../../src/application/usecase/ride/GetRide';
import RequestRide from '../../src/application/usecase/ride/RequestRide';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp';
import PositionRepositoryDatabase from '../../src/infra/repository/PositionRepositoryDatabase';
import RideRepositoryDatabase from '../../src/infra/repository/RideRepositoryDatabase';

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let accountGateway: AccountGateway;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);
    accountGateway = new AccountGatewayHttp();
    requestRide = new RequestRide(rideRepository, accountGateway);
    getRide = new GetRide(rideRepository, positionRepository, accountGateway);
    acceptRide = new AcceptRide(rideRepository, accountGateway);
})

test('Should accept a ride', async function () {
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
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe('accepted');
    expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId)
})

test('Should accept a ride', async function () {
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
    await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrowError('This driver has an active ride')

})

afterEach(async () => {
    await connection.close();
})
