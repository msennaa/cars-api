import AccountController from './infra/controller/AccountController';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import GetAccount from './application/usecase/account/GetAccount';
import SignUp from './application/usecase/account/SignUp';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter, FastifyAdapter, HapiAdapter, HyperExpressAdapter } from './infra/http/HttpServer';
import MailerGatewayFake from './infra/gateway/MailerGatewayFake';
import Registry from './infra/di/Registry';
import { RabbitMQAdapter } from './infra/queue/Queue';
import QueueController from './infra/controller/QueueController';

(async () => {
    const connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    const mailerGateway = new MailerGatewayFake();
    const signup = new SignUp(accountRepository, mailerGateway);
    const getAccount = new GetAccount(accountRepository);
    // const httpServer = new ExpressAdapter();
    // const httpServer = new HapiAdapter();
    const httpServer = new HyperExpressAdapter();
    // const httpServer = new FastifyAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup('signup', 'signup')
    Registry.getInstance().provide('httpServer', httpServer);
    Registry.getInstance().provide('signup', signup)
    Registry.getInstance().provide('getAccount', getAccount);
    Registry.getInstance().provide('queue', queue);
    new AccountController();
    new QueueController();
    httpServer.listen(3001)
})()

