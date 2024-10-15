import GetAccount from '../src/GetAccount';
import { AccountDAOMemory } from '../src/resource';
import SignUp from '../src/SignUp';

let signUp: SignUp;
let getAccount: GetAccount;

beforeEach(() => {
    const accountDAO = new AccountDAOMemory;
    signUp = new SignUp(accountDAO);
    getAccount = new GetAccount(accountDAO);
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
