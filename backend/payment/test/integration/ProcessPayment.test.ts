import ProcessPayment from '../../src/application/usecase/payment/ProcessPayment';
import crypto from 'crypto';
import TransactionRepositoryORM from '../../src/infra/repository/TransactionRepositoryORM';
import ORM from '../../src/infra/orm/ORM';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import GetTransaction from '../../src/application/usecase/payment/GetTransaction';

test('should process payment transaction', async function () {
    const connection = new PgPromiseAdapter();
    const orm = new ORM(connection);
    const transactionRepository = new TransactionRepositoryORM(orm);
    const processPayment = new ProcessPayment(transactionRepository);
    const outputProcessPayment = await processPayment.execute({ rideId: crypto.randomUUID(), amount: 100 });
    const getTransaction = new GetTransaction(transactionRepository);
    const outputGetTransaction = await getTransaction.execute(outputProcessPayment.transactionId);
    expect(outputGetTransaction.transactionId).toBe(outputProcessPayment.transactionId);
    expect(outputGetTransaction.status).toBe('pending');
    expect(outputGetTransaction.amount).toBe(100);
    await connection.close();
})