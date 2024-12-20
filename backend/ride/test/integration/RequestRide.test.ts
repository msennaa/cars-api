import AccountGateway from '../../src/application/gateway/AccountGateway';
import GetRide from '../../src/application/usecase/ride/GetRide';
import RequestRide from '../../src/application/usecase/ride/RequestRide';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp';
import { AxiosAdapter, FetchAdapter } from '../../src/infra/http/HttpClient';
import PositionRepositoryDatabase from '../../src/infra/repository/PositionRepositoryDatabase';
import RideRepositoryDatabase from '../../src/infra/repository/RideRepositoryDatabase';

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let accountGateway: AccountGateway;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);
    // const httpClient = new AxiosAdapter();
    const httpClient = new FetchAdapter();
    accountGateway = new AccountGatewayHttp(httpClient);
    requestRide = new RequestRide(rideRepository, accountGateway);
    getRide = new GetRide(rideRepository, positionRepository, accountGateway);
})

test('Should request a ride', async function () {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const outputSignup = await accountGateway.signup(input)

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide).toBeDefined();
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.rideId).toBe(outputGetRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe('requested');
})

test('Should not request a ride if account belongs a driver', async function () {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: false,
        carPlate: 'AAA9999',
        isDriver: true,
    }
    const outputSignup = await accountGateway.signup(input)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrowError('This account is not from a passenger');
})

test('should not request ride if passenger has unfinished ride', async function () {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const outputSignup = await accountGateway.signup(input)

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    await requestRide.execute(inputRequestRide);
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrowError('This passenger has an active ride');
})

afterEach(async () => {
    await connection.close();
})
