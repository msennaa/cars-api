import AccountController from './infra/controller/AccountController';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import GetAccount from './application/usecase/account/GetAccount';
import SignUp from './application/usecase/account/SignUp';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import { ExpressAdapter, HapiAdapter } from './infra/http/HttpServer';
import MailerGatewayFake from './infra/gateway/MailerGatewayFake';
import Registry from './infra/di/Registry';

const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const mailerGateway = new MailerGatewayFake();
const signup = new SignUp(accountRepository, mailerGateway);
const getAccount = new GetAccount(accountRepository);
const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
Registry.getInstance().provide('httpServer', httpServer);
Registry.getInstance().provide('signup', signup)
Registry.getInstance().provide('getAccount', getAccount);
new AccountController();
httpServer.listen(3000)
