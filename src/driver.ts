import express from 'express';
import AccountService, { AccountServiceProduction } from './application';
import { AccountDAODatabase } from './resource';
import SignUp from './SignUp';
import GetAccount from './GetAccount';


export default class API {
    app: any;

    constructor(readonly signup: SignUp, readonly getAccount: GetAccount) {
        this.app = express();
        this.app.use(express.json());
    }

    build() {
        const accountDAO = new AccountDAODatabase;
        const accountService = new AccountServiceProduction(accountDAO);
        this.app.post("/signup", async (req: any, res: any) => {
            const input = req.body;
            try {
                const output = await this.signup.execute(input);
                res.json(output);
            } catch (error: any) {
                res.status(422).json({
                    message: error.message
                })
            }
        })
        this.app.get('/accounts/:accountId', async (req: any, res: any) => {
            const accountId = req.params.accountId;
            const output = await this.getAccount.execute(accountId);
            res.json(output);
        })
    }

    start() {
        this.app.listen(3000);
    }
}
