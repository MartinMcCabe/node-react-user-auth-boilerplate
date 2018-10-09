const express = require('express')
const bodyParser = require('body-parser')
const {notFound} = require('./utils/errorHandlers')
const graphql = require('./graphql')

const app = express() 

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/graphql', graphql)
app.use(notFound)

module.exports = app