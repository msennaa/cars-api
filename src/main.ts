import AccountController from './AccountController';
import { AccountRepositoryDatabase } from './AccountRepository';
import { PgPromiseAdapter } from './DatabaseConnection';
import GetAccount from './GetAccount';
import { ExpressAdapter, HapiAdapter } from './HttpServer';
import SignUp from './SignUp';
const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const signup = new SignUp(accountRepository);
const getAccount = new GetAccount(accountRepository);
// const httpServer = new ExpressAdapter();
const httpServer = new HapiAdapter();
new AccountController(httpServer, signup, getAccount);
httpServer.listen(3000)
