import { AccountRepositoryDatabase } from './AccountRepository';
import API from './driver';
import GetAccount from './GetAccount';
import SignUp from './SignUp';
const accountRepository = new AccountRepositoryDatabase()
const signup = new SignUp(accountRepository);
const getAccount = new GetAccount(accountRepository);
const api = new API(signup, getAccount);
api.build();
api.start();
