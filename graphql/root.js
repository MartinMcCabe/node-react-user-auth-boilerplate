const { 
    createUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require('./resolvers/user.resolvers')

module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    resetPassword
}