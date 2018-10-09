const nodemailer = require('nodemailer')
const promisify = require('es6-promisify')
const exphbs = require('express-handlebars')
const juice = require('juice')
const {logError} = require('./errorHandlers')

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

const hbs = exphbs.create({
    extname: '.hbs'
})

const generateHTML = async (template, context) => {
    const html = await hbs.render(`email/${template}.hbs`, context)
    return juice(html)
}

exports.sendEmail = async (options, context) => {

    const html = await generateHTML(options.template || 'email-template', context)

    const emailOptions = {
        from: 'Martin <martin.p.mccabe@gmail.com>',
        to: options.user.email,
        subject: options.subject,
        html
    }

    transport.sendMail(emailOptions, (error, info) => {
        if (error) {
            logError(
                {
                    tags: {
                        resolvers: "email",
                    }
                },
                "sendMail",
                error
            )
            return console.error(error);
        }
    })
}