import { AccountRepositoryDatabase, AccountRepositoryMemory } from '../../src/infra/repository/AccountRepository';
import sinon from 'sinon';
import Account from '../../src/domain/Account';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import GetAccount from '../../src/application/usecase/GetAccount';
import SignUp from '../../src/application/usecase/SignUp';
import MailerGateway from '../../src/application/gateway/MailerGateway';
import MailerGatewayFake from '../../src/infra/gateway/MailerGatewayFake';

let connection: DatabaseConnection;
let signUp: SignUp;
let getAccount: GetAccount;
let mailerGateway: MailerGateway;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    mailerGateway = new MailerGatewayFake();
    signUp = new SignUp(accountRepository, mailerGateway);
    getAccount = new GetAccount(accountRepository);
})

test('should create a passenger new account successfully', async () => {
    const stub = sinon.stub(MailerGatewayFake.prototype, 'send').resolves();
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const output = await signUp.execute(input)
    expect(output.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(output.accountId);
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    stub.restore();
})

test('should create a driver new account successfully', async () => {
    const stub = sinon.stub(MailerGatewayFake.prototype, 'send').resolves();
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isDriver: true,
        carPlate: 'AAA0000'
    }
    const output = await signUp.execute(input)
    expect(output.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(output.accountId);
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
    expect(outputGetAccount.carPlate).toBe(input.carPlate)
    stub.restore();
})

test('should not create a new account with invalid cpf', async () => {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '0000000000',
        isPassenger: true
    }
    const promise = signUp.execute(input)
    expect(promise).rejects.toThrowError('Invalid cpf');
})

test('should not create a new account with invalid email', async () => {
    signUp = new SignUp(new AccountRepositoryMemory(), mailerGateway);
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const promise = signUp.execute(input)
    expect(promise).rejects.toThrowError('Invalid email');
})

test('should not create a new account with invalid name', async () => {
    signUp = new SignUp(new AccountRepositoryMemory(), mailerGateway);
    const input = {
        name: 'any_name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const promise = signUp.execute(input)
    expect(promise).rejects.toThrowError('Invalid name');
})

test('should not create a new account with an existing email', async () => {
    const stub = sinon.stub(MailerGatewayFake.prototype, 'send').resolves();
    signUp = new SignUp(new AccountRepositoryMemory(), mailerGateway);
    const email = `any_email${Math.random()}@mail.com`;
    const input = {
        name: 'any name',
        email,
        cpf: '97456321558',
        isPassenger: true
    }
    await signUp.execute(input)
    const promise = signUp.execute(input)
    expect(promise).rejects.toThrowError('Account already exists');
    stub.restore();
})

test('should not create a driver new account with invalid car plate', async () => {
    signUp = new SignUp(new AccountRepositoryMemory(), mailerGateway);
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isDriver: true,
        carPlate: 'AAA000'
    }
    const promise = signUp.execute(input)
    expect(promise).rejects.toThrowError('Invalid car plate');
})

test('should create a passenger account with AccountRepository stub', async function () {
    const stub = sinon.stub(MailerGatewayFake.prototype, 'send').resolves();
    const email = `any_email${Math.random()}@mail.com`
    const inputSignUp = {
        name: 'any name',
        email,
        cpf: '97456321558',
        isPassenger: true
    }
    const inputSignUpStub = Account.create(
        'any name',
        email,
        '97456321558',
        '',
        true,
        false
    )
    const stubSaveAccount = sinon.stub(AccountRepositoryDatabase.prototype, 'saveAccount').resolves();
    const stubGetAccountByEmail = sinon.stub(AccountRepositoryDatabase.prototype, 'getAccountByEmail').resolves(undefined);
    const stubGetAccountById = sinon.stub(AccountRepositoryDatabase.prototype, 'getAccountById').resolves(inputSignUpStub);
    const outputSignUp = await signUp.execute(inputSignUp);
    expect(outputSignUp.accountId).toBeDefined();
    const outputGetAccount = await getAccount.execute(outputSignUp.accountId);
    expect(outputGetAccount.name).toBe(inputSignUp.name)
    expect(outputGetAccount.email).toBe(inputSignUp.email)
    expect(outputGetAccount.cpf).toBe(inputSignUp.cpf)
    stubSaveAccount.restore();
    stubGetAccountByEmail.restore();
    stubGetAccountById.restore();
    stub.restore();
});

afterEach(async () => {
    await connection.close();
})
