import AccountDAO from './resource';
import MailerGateway from './MailerGateway';
import UseCase from './UseCase';
import Account from './Account';

export default class SignUp implements UseCase {
    accountDAO: AccountDAO;
    mailerGateway: MailerGateway;

    constructor(accountDao: AccountDAO) {
        this.accountDAO = accountDao;
        this.mailerGateway = new MailerGateway();
    }

    async execute(input: any): Promise<any> {
        const existingAccount = await this.accountDAO.getAccountByEmail(input.email);
        if (existingAccount) throw new Error('Account already exists');
        const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver);
        await this.accountDAO.saveAccount(account);
        this.mailerGateway.send(account.email, 'Welcome', '');
        return {
            accountId: account.accountId
        };
    }
}


