import Transaction from '../../../domain/entity/Transaction';
import TransactionRepository from '../../repository/TransactionRepository';

export default class ProcessPayment {
    constructor(readonly transactionRepository: TransactionRepository) {

    }

    async execute(input: Input): Promise<Output> {
        console.log('process payment', input);
        const transaction = Transaction.create(input.rideId, input.amount);
        await this.transactionRepository.saveTransaction(transaction);
        return {
            transactionId: transaction.transactionId,
        }
    }
}

type Input = {
    rideId: string,
    amount: number,
}

type Output = {
    transactionId: string,
}
