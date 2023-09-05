const mongoose = require('mongoose')
const { nextTick } = require('process')
const validator = require('validator')
const bcrypt = require('bcrypt')

mongoose.connect(process.env.DATA_BASE_LOCAL,{
    family:4,
    useNewUrlParser:true
}).then(con => {
    console.log(`Data Base Connection Successfully On Port ${process.env.SERVER_PORT}`)
})


const userSchema = new mongoose.Schema({
name:{
    type: String,
    required: [true, 'name is required'],
    unique: true,
    minlength:[8, 'name must be greater than 8 character']
},
    password:{
        type: String,
        required: true,
        minlength:[8, 'password must be greater than 8 characters'],
        select: false
    },
    passConfirm:{
        type:String,
        required: true,
        validate:{
            validator: function(el){
               return el === this.password
            },
            message: 'please confirm your password'
        }
    },
    phoneNumber:{
        type: String,
        unique: true,
        validate:{
            validator: function(el){
                const element = String(el)
                if(element.startsWith('+234')){
                    return element.slice(4).length === 10
                }else {
                    return element.length === 11
                }
            },

            message: 'Invalid Mobile Number'
        }
    },
    email:{
        type: String,
        required:[true, 'email is required'],
        validate:[validator.isEmail, 'please inpite a valid email'],
        unique: true
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    devices:[],
    passChangedAt: Date,
    passExpires: Date
})

userSchema.pre('save', async function(){
    if(!this.isModified('password'))
    return next();
    this.password = await bcrypt.hash(this.password, 5);
    this.passConfirm = undefined
})

userSchema.pre('save', function(next){
    if(this.isModified('password') || this.isNew)

    this.passChangedAt = new Date
    next()
})

userSchema.pre(/^find/, function(next){
    this.find({active:{$ne:true}});
    next()
})
userSchema.methods.correctPass = async function(candidiatePass, userpass){
    return bcrypt.compare(candidiatePass, userpass);
}



const userModel = mongoose.model('User', userSchema)

module.exports = userModel