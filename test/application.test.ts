import GetAccount from '../src/GetAccount';
import { AccountRepositoryDatabase } from '../src/AccountRepository';
import SignUp from '../src/SignUp';
import sinon from 'sinon';
import Account from '../src/Account';
import DatabaseConnection, { PgPromiseAdapter } from '../src/DatabaseConnection';

let connection: DatabaseConnection;
let signUp: SignUp;
let getAccount: GetAccount;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    signUp = new SignUp(accountRepository);
    getAccount = new GetAccount(accountRepository);
})

test('should create a passenger new account successfully', async () => {
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
})

test('should create a driver new account successfully', async () => {
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
})

test('should not create a driver new account with invalid car plate', async () => {
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
});

afterEach(async () => {
    await connection.close();
})
