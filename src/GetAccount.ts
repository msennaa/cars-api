import AccountDAO from './resource';
import UseCase from './UseCase';

export default class GetAccount implements UseCase {
    accountDAO: AccountDAO;

    constructor(accountDao: AccountDAO) {
        this.accountDAO = accountDao;
    }

    async execute(accountId: string): Promise<any> {
        const account = await this.accountDAO.getAccountById(accountId);
        return account;
    }
}


