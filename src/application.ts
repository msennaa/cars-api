import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from './resource';

export async function signup(input: any): Promise<any> {
    const account = {
        accountId: crypto.randomUUID(),
        name: input.name,
        email: input.email,
        cpf: input.cpf,
        carPlate: input.carPlate,
        isPassenger: input.isPassenger,
        isDriver: input.isDriver
    };
    const existingAccount = await getAccountByEmail(input.email);
    if (existingAccount) throw new Error('Account already exists');
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name');
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email');
    if (!validateCpf(input.cpf)) throw new Error('Invalid cpf');
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error('Invalid car plate');
    await saveAccount(account);
    return {
        accountId: account.accountId
    };
}

export async function getAccount(accountId: string): Promise<any> {
    const account = await getAccountById(accountId);
    return account;
}
