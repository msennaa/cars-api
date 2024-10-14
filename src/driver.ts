import express from 'express';
import AccountService from './application';
const app = express();
app.use(express.json());
const accountService = new AccountService();

app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const output = await accountService.signup(input);
        res.json(output);
    } catch (error: any) {
        res.status(422).json({
            message: error.message
        })
    }
})


app.get('/accounts/:accountId', async function (req, res) {
    const accountId = req.params.accountId;
    const output = await accountService.getAccount(accountId);
    res.json(output);
})

app.listen(3000);
