import axios from 'axios';

axios.defaults.validateStatus = function () {
    return true;
}

test('should create a passenger new account successfully', async () => {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    const responseSignUp = await axios.post("http://localhost:3001/signup", input)
    const outputSignUp = responseSignUp.data;
    expect(outputSignUp.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3001/accounts/${outputSignUp.accountId}`)
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(input.name)
    expect(outputGetAccount.email).toBe(input.email)
    expect(outputGetAccount.cpf).toBe(input.cpf)
})

test('should create a passenger new account successfully async', async () => {
    const input = {
        name: 'any name',
        email: `any_email_async${Math.random()}@mail.com`,
        cpf: '97456321558',
        isPassenger: true
    }
    await axios.post("http://localhost:3001/signup_async", input)
})

test('should not create a passenger with invalid cpf', async () => {
    const input = {
        name: 'any name',
        email: `any_email${Math.random()}@mail.com`,
        cpf: '00000000000',
        isPassenger: true
    }
    const responseSignUp = await axios.post("http://localhost:3001/signup", input)
    const outputSignUp = responseSignUp.data;
    expect(responseSignUp.status).toBe(422);
    expect(outputSignUp.message).toBe('Invalid cpf')
})
