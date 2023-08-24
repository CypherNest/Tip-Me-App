const express = require('express');
const dotenve = require('dotenv');


dotenve.config({path: './config.env'})

const userRouter = require('./routes/userRouter')

const app = express();



app.use(express.json())

app.use('/api/V1/Tip_Me', userRouter)

const port = process.env.SERVER_PORT
app.listen(port, () => {
    console.log(`App Runing On Port: ${port}`);
})