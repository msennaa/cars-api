import express from 'express';
import { getAccount, signup } from './application';
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    const input = req.body;
    try {
        const output = await signup(input);
        res.json(output);
    } catch (error: any) {
        res.status(422).json({
            message: error.message
        })
    }
})


app.get('/accounts/:accountId', async function (req, res) {
    const accountId = req.params.accountId;
    const output = await getAccount(accountId);
    res.json(output);
})

app.listen(3000);
