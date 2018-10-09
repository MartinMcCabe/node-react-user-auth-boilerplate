const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
const root = require('./root')
const { authenticate } = require('../controllers/user.controller')

const options = async (req, res) => {
    const user = await authenticate(req)
    return {
        context: {
            user
        },
        schema,
        pretty: true,
        rootValue: root,
        graphiql: true 
    }
}

module.exports = graphqlHTTP(options) 