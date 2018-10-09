const { buildSchema } = require('graphql');

// construct a schema, using GraphQL language
module.exports = buildSchema(`

    type Query {
        users: [User]
    }

    type Mutation {
        createUser(name: String!, email: String!, password: String!, confirmPassword: String!): LoginPayload
        loginUser(email: String!, password: String!): LoginPayload
        forgotPassword(email:String!): SimpleMessagePayload
        resetPassword(email:String!, resetPasswordToken: String!, password:String!, confirmPassword: String!): LoginPayload
    }

    type LoginPayload {
        token: String
        user: User
    }

    type SimpleMessagePayload {
        message: String
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        gravatar: String
    }
`)

