const fs = require('fs')
const path = require('path')
const showdown = require('showdown')
const nodemailer = require('nodemailer')
const configuration = require('./configurator').configuration

const headPath = path.join(__dirname, '../res/head')
const footPath = path.join(__dirname, '../res/foot')

function convertMarkdownToHtml(markdownPath) {
    const text = fs.readFileSync(markdownPath, 'utf8')
    const converter = new showdown.Converter()
    const html = converter.makeHtml(text);
    return html
}

function inlineStyle(html) {
    const head = fs.readFileSync(headPath)
    const foot = fs.readFileSync(footPath)
    let styledHTML = head
    styledHTML += html
    styledHTML += foot
    return styledHTML
}

function sendEmail(html, options) {
    const { service = configuration.smtp_service,
      from = configuration.from,
      password = configuration.password,
      to = configuration.to,
      subject = configuration.subject,
    } = options
    var transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: from,
        pass: password
    }
    });
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: html
      };
      console.log('sending...')
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

function send(markdownPath, options) {
   let html = convertMarkdownToHtml(markdownPath)
   html = inlineStyle(html)
   sendEmail(html, options)
}

module.exports = {
    send
}