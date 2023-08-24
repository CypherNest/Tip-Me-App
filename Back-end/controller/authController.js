const User = require('../models/userModel')
const catchAsync  = require('../routes/utills/catchAsync')
const session = require('express-session')


exports.getAllUser = catchAsync(async(req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data:{
            users
        }
    })
})


exports.signUp = catchAsync(async(req, res, next) => {
    const user = await User.create(req.body)
    res.status(201).json({
        status: 'success',
        data:{
            user
        }
    })
})


exports.login = catchAsync(async(req, res, next) => {

    const  { email } = req.body
    const user = await  User.findOne(email)
    res.status(200).json({
        status: 'success',
        data:{
            user
        } 
    })
})

exports.sessionTimeOut = catchAsync(async(req, res, next) => {
    const userId = req.session.userId;
    const user = users[userId]
})