const User = require('../models/userModel')
const catchAsync  = require('../routes/utills/catchAsync')


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