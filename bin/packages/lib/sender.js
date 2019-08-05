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

function sendEmail(html) {
    var transporter = nodemailer.createTransport({
    service: configuration.smtp_service,
    auth: {
        user: configuration.from,
        pass: configuration.password
    }
    });
    var mailOptions = {
        from: configuration.from,
        to: configuration.to,
        subject: configuration.subject,
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

function send(markdownPath) {
   let html = convertMarkdownToHtml(markdownPath)
   html = inlineStyle(html)
   sendEmail(html)
}

module.exports = {
    send
}