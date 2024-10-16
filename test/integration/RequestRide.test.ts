import MailerGateway from '../../src/application/gateway/MailerGateway';
import SignUp from '../../src/application/usecase/account/SignUp';
import GetRide from '../../src/application/usecase/ride/GetRide';
import RequestRide from '../../src/application/usecase/ride/RequestRide';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import MailerGatewayFake from '../../src/infra/gateway/MailerGatewayFake';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import RideRepositoryDatabase from '../../src/infra/repository/RideRepositoryDatabase';

let connection: DatabaseConnection;
let signUp: SignUp;
let mailerGateway: MailerGateway;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    mailerGateway = new MailerGatewayFake();
    signUp = new SignUp(accountRepository, mailerGateway);
    const rideRepository = new RideRepositoryDatabase(connection);
    requestRide = new RequestRide(rideRepository);
    getRide = new GetRide(rideRepository);
})

test('Should request a ride', async function () {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const outputSignup = await signUp.execute(input)

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

afterEach(async () => {
    await connection.close();
})
