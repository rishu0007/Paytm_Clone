const express = require('express');
const rootRouter = require('./routes')
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);


app.listen(3000);


// /api/v1/user/signup
// /api/v1/user/signin
// /api/v1/user/changePassword 


// /api/v1/account/transferMoney
// /api/v1/account/balance