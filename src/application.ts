import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from './resource';
import MailerGateway from './MailerGateway';

export default interface AccountService {
    signup(input: any): Promise<any>;
    getAccount(accountId: string): Promise<any>;
}

export class AccountServiceProduction implements AccountService {
    accountDAO: AccountDAO;
    mailerGateway: MailerGateway;

    constructor(accountDao: AccountDAO) {
        this.accountDAO = accountDao;
        this.mailerGateway = new MailerGateway();
    }

    async signup(input: any): Promise<any> {
        const account = {
            accountId: crypto.randomUUID(),
            name: input.name,
            email: input.email,
            cpf: input.cpf,
            carPlate: input.carPlate,
            isPassenger: input.isPassenger,
            isDriver: input.isDriver
        };
        const existingAccount = await this.accountDAO.getAccountByEmail(input.email);
        if (existingAccount) throw new Error('Account already exists');
        if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name');
        if (!input.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email');
        if (!validateCpf(input.cpf)) throw new Error('Invalid cpf');
        if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error('Invalid car plate');
        await this.accountDAO.saveAccount(account);
        this.mailerGateway.send(account.email, 'Welcome', '');
        return {
            accountId: account.accountId
        };
    }

    async getAccount(accountId: string): Promise<any> {
        const account = await this.accountDAO.getAccountById(accountId);
        return account;
    }
}


