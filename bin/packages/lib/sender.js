const fs = require('fs')
const showdown = require('showdown')
const nodemailer = require('nodemailer')
const configuration = require('./configurator').configuration

function convertMarkdownToHtml(markdownPath) {
    const text = fs.readFileSync(markdownPath, 'utf8')
    const converter = new showdown.Converter()
    const html = converter.makeHtml(text);
    return html
}

function sendEmail(html) {
    var transporter = nodemailer.createTransport({
    service: configuration.smtp_server,
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
   const html = convertMarkdownToHtml(markdownPath)
   sendEmail(html)
}

module.exports = {
    send
}