const mongoose = require('mongoose')
const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const md5 = require('md5')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: 'Please supply an email address',
        unique: true,
        lowercase: true,
        trim: true,
        validate: [ validator.isEmail, 'Not a valid email address' ]
    },
    password: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
})

userSchema.virtual('gravatar').get(function(){
    const hash = md5(this.email)
    return `https://gravatar.com/avatar/${hash}?s=200`
})

userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)