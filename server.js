const express = require('express');
const dotenve = require('dotenv');
const session = require('express-session')
const redis = require('redis')


dotenve.config({path: './config.env'})

const userRouter = require('./Back-end/routes/userRouter')
const app = express();

// const redisClient = redis.createClient();

// app.use(session({
//     secret: process.env.REDIS_SECRET,
//     store: new (require('connect-redis'),(session)({ client: redisClient })),
//     resave: false,
//     saveUninitialized: true
// }))

// req.session.isLoggedIn()



app.use(express.json())

app.use('/api/V1/Tip_Me', userRouter)

const port = process.env.SERVER_PORT
app.listen(port, () => {
    console.log(`App Runing On Port: ${port}`);
})