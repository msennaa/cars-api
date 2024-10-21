import MailerGateway from '../../src/application/gateway/MailerGateway';
import SignUp from '../../src/application/usecase/account/SignUp';
import AcceptRide from '../../src/application/usecase/ride/AcceptRide';
import GetRide from '../../src/application/usecase/ride/GetRide';
import RequestRide from '../../src/application/usecase/ride/RequestRide';
import StartRide from '../../src/application/usecase/ride/StartRide';
import UpdatePosition from '../../src/application/usecase/ride/UpdatePosition';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import MailerGatewayFake from '../../src/infra/gateway/MailerGatewayFake';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import PositionRepositoryDatabase from '../../src/infra/repository/PositionRepositoryDatabase';
import RideRepositoryDatabase from '../../src/infra/repository/RideRepositoryDatabase';

let connection: DatabaseConnection;
let signUp: SignUp;
let mailerGateway: MailerGateway;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    mailerGateway = new MailerGatewayFake();
    signUp = new SignUp(accountRepository, mailerGateway);
    const rideRepository = new RideRepositoryDatabase(connection);
    const positionRepository = new PositionRepositoryDatabase(connection);
    requestRide = new RequestRide(rideRepository, accountRepository);
    getRide = new GetRide(rideRepository, positionRepository);
    acceptRide = new AcceptRide(rideRepository, accountRepository);
    startRide = new StartRide(rideRepository);
    updatePosition = new UpdatePosition(rideRepository, positionRepository);
})

test.only('Should update position from a ride', async function () {
    const inputPassenger = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const outputSignupPassenger = await signUp.execute(inputPassenger)
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
    const outputSignupDriver = await signUp.execute(inputDriver)
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
    }

    const secondUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476
    }
    await updatePosition.execute(firstUpdatePosition);
    await updatePosition.execute(secondUpdatePosition);
    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.currentLat).toBe(-27.496887588317275);
    expect(outputGetRide.currentLong).toBe(-48.522234807851476);
    expect(outputGetRide.distance).toBe(10);
})

afterEach(async () => {
    await connection.close();
})
