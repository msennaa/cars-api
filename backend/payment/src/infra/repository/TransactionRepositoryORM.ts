import TransactionRepository from '../../application/repository/TransactionRepository';
import ORM from '../orm/ORM';
import TransactionModel from '../orm/TransactionModel';

export default class TransactionRepositoryORM implements TransactionRepository {
    constructor(readonly orm: ORM) {

    }

    async saveTransaction(transaction: any): Promise<void> {
        const transactionModel = TransactionModel.getModelFromAggregate(transaction);
        return await this.orm.save(transactionModel);
    }

    async getTransactionById(transactionId: string): Promise<any> {
        const transactionModel = await this.orm.get('transaction_id', transactionId, TransactionModel);
        return transactionModel.getAggregate();
    }
}
