import API from './driver';
import GetAccount from './GetAccount';
import { AccountDAODatabase } from './resource';
import SignUp from './SignUp';
const accountDAO = new AccountDAODatabase()
const signup = new SignUp(accountDAO);
const getAccount = new GetAccount(accountDAO);
const api = new API(signup, getAccount);
api.build();
api.start();
