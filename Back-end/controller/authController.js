const User = require('../models/userModel')
const catchAsync  = require('../routes/utills/catchAsync')
const session = require('express-session')
const jwt = require('jsonwebtoken');
const Mail = require('../')


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

const welcomeMail = async() => {
    const newUser = await User.findOne({email});
    const name = newUser.name;
    const token = generateToken()
    message = `Dear ${name.split(' ')[1].toUpperCase()} Welcome To Our Mobile Financial App\n
    Kindly Verify Your registration with the Above OTP\n
    Please Dont Share With Anyone ${token}\n
    Only Valid For 10 min\n\n\n\n
    Thanks For Your Support`

Mail.sendMail({

})

}

            //// Sign Up /////

exports.signUp = catchAsync(async(req, res, next) => {
    
    const { email } = req.body

    if(req.query.email){
        const user = await User.findOne({email})

    }

    const Newuser = await User.create({email});

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
    const Email = mail.replace(
        mail.substring(2, atIdex), '*'.repeat(5));

        const number = Newuser.phoneNumber;

        const visileDigit = number.slice(-2);
        const markedPadStart = '*'.repeat(7, -2);
        const phoneNumber = markedPadStart+visileDigit
        
        res.status(201).json({
            status: 'success',
            data:{
                Email,
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