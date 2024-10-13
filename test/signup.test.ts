import { signup } from '../src/signup'

test('should create a passenger new account successfully', async () => {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const output = await signup(input)
    expect(output.accountId).toBeDefined();
})

test('should create a driver new account successfully', async () => {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isDriver: true,
        carPlate: 'AAA0000'
    }
    const output = await signup(input)
    expect(output.accountId).toBeDefined();
})


test('should not create a new account with invalid cpf', async () => {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '0000000000',
        isPassenger: true
    }
    const output = await signup(input)
    expect(output).toBe(-1)
})
