const User = require('../models/userModel')
const  Mail = require('../routes/utills/email')
const catchAsync  = require('../routes/utills/catchAsync')
const session = require('express-session')
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const crypto = require('crypto')




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


const generateToken = () => {
    const randomBytes = crypto.randomBytes(6);
    const randomInt = parseInt(randomBytes.toString('hex'), 16);
    const token = randomInt % Math.pow(10, 6);
    return token.toString().padStart(6, '0');
    }
    ///////  Create A Bearer Token For Athothorization Headers ////
            
    const signToken = Id =>
        jwt.sign({Id}, process.env.JWT_SECRETE,{
        expiresIn: process.env.JWT_EXP
        })
        
const sendCookie = (token, res) => {
    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIES_EXP * 24 * 60 * 60 * 1000
            ),
        // httpOnly: true,
            secure: true
        };
        if(process.env.NODE_ENV === 'production') cookieOption.secure = true
        res.cookie('jwt', token, cookieOption)
    }
            
            /////////  SignUP Users ////////////
            
exports.signUp = catchAsync( async (req, res, next) => {
            
        const {email} = req.body;
        console.log(email, req.body);
            
if(req.query.email){
    const  email = req.query.email
    console.log(req.query)
            const newUser = await User.findOne( { email } );
            console.log(newUser)
            const name = newUser.name;
            const token = generateToken();

            if(req.query.email === newUser.email){
                
    // create A subject and message to send as mail to the user along with the token
                const subject = '[ SKYSHOW.NG  ] Please Verify Your SingUp';
                message = `Dear ${name}\nWelcome to Skyshowing mobile application\n
                Use this One Time Password (OTP) below complete your signUp\n
                ${token} \n\n\n\n\n\nThanks for you surport`
            
            //    send a mail to the user 
                Mail.sendEmail({
                    email: newUser.email,
                    subject,
                    message
                });
            
            
            newUser.token = token;
            await newUser.save({validateBeforeSave: false})
            
                res.status(200).json({
                    status:'success',
                    message: 'A verifaction code was sent to your mail  '
                })
            }
            }
            
            if(req.query.Number){
                const phoneNumber = req.query.Number;
                console.log(req.query)
                const newUser = await User.findOne( { phoneNumber } );
                console.log(newUser);
                const name = newUser.name;
                const token = generateToken()
        
                if(req.query.Number === newUser.phoneNumber){
                    const accountSid = process.env.TWILIO_ACCOUNT_SID
                    const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
                    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
                    const message = `Dear ${name}\n\nuse the (OTP) to verify your signUp\n\nplease dont share with any one ${token}\n\nThank's for surport`
                    const client = twilio(accountSid, authToken);
                    
                    // Sms body 
                    client.messages
                    .create({
                        body: message,
                        from: twilioPhoneNumber,
                        to: '+234'+ newUser.phoneNumber
                    })
                    .then(message => console.log('sms sent successfully:', message.sid))
                    .catch(error => console.error('Error sending SMS:', error));
            
            
            newUser.token = token;
            await newUser.save({validateBeforeSave: false})
            
                    res.status(200).json({
                        status:'success',
                        message: 'We send A verificartion code to you mobile Number'
                    });
                }
            };
            
            
            if(req.query.verify){
                const token = req.query.verify
            
                const user = await User.findOne( { token } );
            
                if(!user){
                    return next(new AppError('please singUp with a valid credential', 400))
                }
                    if (req.query.verify === user.token){
                        user.token = undefined
                        user.verify = 'verified'
                        await user.save({validateBeforeSave: false})
            
                        const jwtToken = signToken(user._id)
                        sendCookie(jwtToken, res);
                        await user.save({validateBeforeSave: false})
                        res.status(200).json({
                            status: "success",
                            data:{
                                username: user.username,
                                message:'confirmed',
                                jwtToken,
                            }
                        })
                    }else {
                        res.status(400).json({
                        status:'failed',
                        message: 'Invalid Token'
                    })
                }
            }

            const NewUser = (await User.create(req.body));

            if(!NewUser){
                return next(new AppError('Please use a valid credential', 400))
            }
            const mail = NewUser.email;
            
            const atIndex = mail.indexOf('@');
            const Email = mail.replace(mail
                .substring(2, atIndex),
                 '*'.repeat(5))
            
                const number = NewUser.phoneNumber;
            
                const visibleDigit = number.slice(-2);
                const markedPart = '*'.repeat(7, -2);
                const PhoneNumber = markedPart+visibleDigit
            
                const jwtToken = signToken(NewUser._id)
            
                res.status(200).json({
                    jwtToken,
                    status: 'sucess',
                    data:{
                        PhoneNumber,
                        Email,
                        jwtToken
                    }
                })
            }
        )
            //////////////    Login Users //////////////
    exports.login = catchAsync(async(req, res, next) => {
            
                const { email, password} = req.body;
                console.log(req.body);
                console.log(email);
                if(!email || !password){
                    // return next(new AppError('please provide email and password', 404));
                    res.status(403).json({
                        status: 'fail',
                        message: 'please provide email and password'
                    })
                }
            
                // find user with his credential and validate it
                const user = await User.findOne({ email }).select('password');
                console.log(user, email)
                const verifiedUser = await User.findById(user._id).select('verify')
            // if not user send a error message to the user
            console.log(user.password, password)
                if(!user || !(await user.correctPass(password, user.password))){
                    // return next(new AppError('Invalid Email or password', 404))
                    console.log('failed')
                    res.status(403).json({
                        status: 'fail',
                        message: 'Invalid Email or password'
                    })
                // }else if(!verifiedUser.verify){
                //     // return next(
                //     //     new AppError('Something went wrong', 403));
                //     res.status(403).json({
                //         status: 'fial',
                //         message: 'Something went wrong'
                //     })
                    } else {
                        console.log('success')
                        const jwtToken = signToken(user._id);
                        sendCookie(jwtToken, res)
                        res.status(200).json({
                            status: 'success',
                            jwtToken
                        })
                    }
            });
            