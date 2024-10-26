import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter, HapiAdapter } from './infra/http/HttpServer';
import Registry from './infra/di/Registry';
import ProcessPayment from './application/usecase/payment/ProcessPayment';
import PaymentController from './infra/controller/PaymentController';
import { RabbitMQAdapter } from './infra/queue/Queue';

(async () => {
    const connection = new PgPromiseAdapter();
    const httpServer = new ExpressAdapter();
    // const httpServer = new HapiAdapter();
    const processPayment = new ProcessPayment();
    new PaymentController(httpServer, processPayment)
    const queue = new RabbitMQAdapter();
    await queue.connect();
    queue.consume('rideCompleted.processPayment', async (input: any) => {
        await processPayment.execute(input);
    })
    httpServer.listen(3002)
})();

