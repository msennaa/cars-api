import AccountGateway from '../../src/application/gateway/AccountGateway';
import AcceptRide from '../../src/application/usecase/ride/AcceptRide';
import GetRide from '../../src/application/usecase/ride/GetRide';
import RequestRide from '../../src/application/usecase/ride/RequestRide';
import StartRide from '../../src/application/usecase/ride/StartRide';
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
    const inputStartRide = {
        rideId: outputRequestRide.rideId,
    }
    await startRide.execute(inputStartRide);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe('in_progress');
})

afterEach(async () => {
    await connection.close();
})
