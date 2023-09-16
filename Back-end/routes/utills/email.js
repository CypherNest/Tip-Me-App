const nodemailer = require('nodemailer');

exports.sendEmail = option => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'isihaqabdullahi01@gmail.com',
            pass: 'mfhjloaeznxnohqa'
        }
});

const mailoption = {
    from: 'SkyShowng  <abdullahi>',
    to: option.email,
    subject: option.subject,
    text: option.message,
    };


    transporter.sendMail(mailoption, function(error, info) {
        if(error){
            console.log(error)
        }else {
            console.log('Email sent' +info.response)
        }
    });
}

