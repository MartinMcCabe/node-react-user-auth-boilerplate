const mongoose = require('mongoose')

require('dotenv').config({ path: 'variables.env' })

mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise // tell mongoose to use ES6 Promise
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
})

// requirte Models here
require ('./models/user.model')

// start the app
const app = require('./app')
const port = process.env.PORT || 7777

app.listen(port, () => console.log(`Listening on port ${port}`))