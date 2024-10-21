import UseCase from '../UseCase';
import AccountRepository from '../../repository/AccountRepository';

export default class GetAccount implements UseCase {
    accountRepository: AccountRepository;

    constructor(accountRepository: AccountRepository) {
        this.accountRepository = accountRepository;
    }

    async execute(accountId: string): Promise<Output> {
        const account = await this.accountRepository.getAccountById(accountId);
        return {
            accountId: account.accountId,
            name: account.getName(),
            email: account.getEmail(),
            cpf: account.getCpf(),
            carPlate: account.getCarPlate(),
            isPassenger: account.isPassenger,
            isDriver: account.isDriver,
            password: account.password
        }
    }
}

type Output = {
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean,
    password: string,
}
