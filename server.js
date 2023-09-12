const express = require('express');
const dotenve = require('dotenv');
const session = require('express-session')
const redis = require('redis')
const mongoose = require('mongoose')


dotenve.config({path: './config.env'})

const userRouter = require('./Back-end/routes/userRouter')

const app = express();
const port = process.env.SERVER_PORT || 4312

const db = process.env.personal_DB;
const DB = db.replace('<password>', process.env.personal_pass)

console.log(DB)


const connectDB = async() => {
    
    try{
    const conn = await mongoose.connect(DB,{
    family:4,
    useNewUrlParser:true
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
} catch(err) {
    console.log(err.message)
    process.exit(1)
}
}

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

connectDB().then( () => {
    app.listen(port, () => {
        console.log(`App Runing On Port: ${port}`);
    })
})