const User = require('../models/userModel')
const catchAsync  = require('../routes/utills/catchAsync')
const session = require('express-session')
const jwt = require('jwt');


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

    const Newuser = await User.create(req.body);

    if(!Newuser){
        res.status(403).json({
            staus: 'success',
            data:{
                Newuser
            }
        })
    }

    const mail = Newuser.email

    const atIdex = mail.indexOf('@');
    const email = mail.replace(
        mail.substring(2, atIdex), '*'.repeat(5));

        const number = Newuser.phoneNumber;

        const visileDigit = number.slice(-2);
        const markedPadStart = '*'.repeat(7, -2);
        const phoneNumber = markedPadStart+visileDigit
        
        res.status(201).json({
            status: 'success',
            data:{
                email,
                phoneNumber
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