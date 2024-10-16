import crypto from "crypto";
import { validateCpf } from './validateCpf';

export default class Account {
    constructor(readonly accountId: string, readonly name: string, readonly email: string, readonly cpf: string, readonly carPlate: string, readonly isPassenger: boolean, readonly isDriver: boolean) {
        if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name');
        if (!email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email');
        if (!validateCpf(cpf)) throw new Error('Invalid cpf');
        if (isDriver && !carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error('Invalid car plate');
    }

    static create(name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
    }
}
