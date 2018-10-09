const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = mongoose.model('User')
/** 
 * register a new user
 */
exports.register = async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10)
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
    })

    await user.save()
    res.json({
        success: true
    })
}

/**
 * Sign user in
 * return jwt token for future use
 */
exports.login = async(req, res) => {
    const user = await User.findOne({email: req.body.email})
    const match = await bcrypt.compare(req.body.password, user.password)
    if(match) {
        // create jwt
        const token = jwt.sign(
            {
                email: user.email,
                _id: user._id
            },
            process.env.APP_SECRET
        )
        return res.json({
            success: 'User Authenticated.',
            token // respond with token
        })
    }else{
        return res.status(401).json({
            failed: 'Unauthorised access. soz.'
        })
    }
}

exports.testAuth = async (req, res) => {
    if(req.user){
        res.status(200).json(req.user)
    }else{
        res.status(401).json({fail: 'you need to be logged in to view this'})
    }
}

exports.authMiddelware = async (req, res, next) => {
    if(req.headers && req.headers.authorization) {
        const {authorization} = req.headers
        const token = authorization.replace('JWT ', '')
        _user = jwt.verify(token, process.env.APP_SECRET)
        if(_user){
            req.user = await User.findOne({_id: mongoose.Types.ObjectId(_user._id), active: true})
            next()
        }else{
            req.user = undefined
            next()
        }
    }else{
        req.user = undefined
        next()
    }
}

exports.authenticate = async (req) => {
    if(req.headers && req.headers.authorization) {
        const {authorization} = req.headers
        const token = authorization.replace('JWT ', '')
        _user = jwt.verify(token, process.env.APP_SECRET)
        if(_user){
            try{
                const u = await User.findOne({_id: mongoose.Types.ObjectId(_user._id), active: true})
                console.log('USER AUTHENTICATED')
                return u
            }catch(e){
                //TODO ERROR Handling
            }
        }else{
            return undefined
        }
    }else{
        return undefined
    }
}
