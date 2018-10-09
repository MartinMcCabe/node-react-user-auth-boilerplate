const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = mongoose.model('User')
const { logError } = require('../../utils/errorHandlers')
const { sendEmail } = require('../../utils/mailer')
const crypto  = require('crypto')

/**
 * create new user
 */
exports.createUser = async ({name, email, password, confirmPassword}) => {
    let newUser = {
        name,
        email
    }

    if(password !== confirmPassword) {
        throw 'passwords don\'t match'
    }

    const hash = await bcrypt.hash(password, 10)
    const createdUser = new User({
        email: email,
        password: hash,
        name
    })

    try{
        await createdUser.save()
        const token = jwt.sign(
            {
                email: createdUser.email,
                _id: createdUser._id
            },
            process.env.APP_SECRET
        )
        
        const user = {
            ...newUser,
            id: createdUser._id.toString()
        }

        sendEmail({user, subject: 'hello'}, {
            name: user.name,
            message: `<p>Welcome to the expense tracker app!</br>Click below to log in an get started now!</p>`,
            cta: `log in`,
            ctaurl: `http://localhost:5000/login`
        })

        return { token, user }

    }catch(error){
        logError(
            {
                tags: {
                    resolvers: "resolvers",
                    mongo: "mongo collection"
                }
            },
            "Mutation: createUser",
            error
        )
        throw error.message

    }
} 

/**
 * Log in user
 */
exports.loginUser = async ({email, password}) => {
    try{
        const user = await User.findOne({email: email, active: true})
        if(user) {
            const match = await bcrypt.compare(password, user.password)
            if(match) {
                // create jwt
                const token = jwt.sign(
                    {
                        email: user.email,
                        _id: user._id
                    },
                    process.env.APP_SECRET
                )
                return { token, user }
    
            }else{
                throw "Email or password incorrect";
            }
        }else{
            throw "Email or password incorrect";
        }

    }catch(error){
        logError(
            {
                tags: {
                    resolvers: "resolvers",
                    mongo: "mongo collection"
                }
            },
            "Mutation: loginUser - findOne",
            error
        )
        
        throw error
    }  
}

exports.forgotPassword = async ({email}) => {
    try{

        const user = await User.findOne({email, active: true})
        if(!user){
            throw 'No user with this email exists'
        }

        user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        const resetURL = `${process.env.HOST}/resetPassword/${user.resetPasswordToken}`
        await user.save()
        sendEmail({user, subject: 'Expense Tracker: Password reset request'}, {
            name: user.name,
            message: `<p>You're receiving this email because you requested a password reset on the Expense Tracker app. </br>
                If you didn't request this erset, please ignore this email. </br>
                To choose a new password, click on the link below.
            </p>`,
            cta: `change my password now 🔒`,
            ctaurl: resetURL
        })

        return { 
            message: 'A password reset request has been generated and emailed to you.'
        }


    }catch(error) {
        logError(
            {
                tags: {
                    resolvers: "resolvers",
                    mongo: "mongo collection"
                }
            },
            "Mutation: forgotPassword",
            error
        )
        
        throw 'Sorry, There seems to be a problem'
    }
}

exports.resetPassword = async ({email, resetPasswordToken, password, confirmPassword}) => {
    try{

        const user = await User.findOne({
            email, 
            resetPasswordToken, 
            resetPasswordExpires: { $gt: Date.now() },
            active: true})

        if(!user) {
            throw 'Something went wrong. Please try again later.'
        }

        if(password === confirmPassword) {
            const hash = await bcrypt.hash(password, 10)
            user.password = hash

            await user.save()
            const token = jwt.sign(
                {
                    email: user.email,
                    _id: user._id
                },
                process.env.APP_SECRET
            )
            
            return { token, user }

        }else{
            throw 'Passwords don\'t match'
        }

    }catch(error) {
        logError(
            {
                tags: {
                    resolvers: "resolvers",
                    mongo: "mongo collection"
                }
            },
            "Mutation: resetPassword",
            error
        )
        
        throw 'Sorry, There seems to be a problem'
    }
}