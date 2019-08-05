#!/usr/bin/env node

const configurator = require('./packages/lib/configurator')
const sender = require('./packages/lib/sender')
const chalk = require('chalk')

const program = require('commander')
program.version('1.0.6')

program.command('init')
        .description('Init mm')
        .action(function () {
          configurator.initConfiguration()
        })
program.command('config')
        .description('Config mm')
        .option('-l, --list', 'list the current configuration')
        .option('-s, --service <service>', 'config the SMTP service you will use to send your email')
        .option('-f, --from <from>', 'config the from address')
        .option('-t, --to <to...>','config the to addresses, multi addresses should be seperated by commas')
        .option('-b, --subject <subject>', 'config the subject')
        .option('-p, --password <password>', 'config password. Note it is the app specific password not the account password. For example if you are using gmail service, you can check this link for help: https://support.google.com/accounts/answer/185833?hl=en')
        .action(function (options) {
          if (!configurator.isConfigurationValid()) {
            console.log(chalk.red('Please set up your email configuration use mm init first!'))
            program.help()
          }
          if (options.list === true) {
            console.log(chalk.gray('Below is the current configuration:\n'),configurator.configuration)
            return
          }
          if (typeof options.service !== 'undefined') {
            configurator.updateConfiguration('smtp_service', options.service)
          }
          if (typeof options.from !== 'undefined') {
            configurator.updateConfiguration('from', options.from)
          }
          if (typeof options.to !== 'undefined') {
            configurator.updateConfiguration('to', options.to)
          }
          if (typeof options.subject !== 'undefined') {
            configurator.updateConfiguration('subject', options.subject)
          }
          if (typeof options.password !== 'undefined') {
            configurator.updateConfiguration('password', options.password)
          }
        })
program.command('send <markdown-path>')
        .description('send email')
        .action(function (markdownPath) {
          if (!configurator.isConfigurationValid()) {
            console.log(chalk.red('Please set up your email configuration use mm init first!'))
            program.help()
          }
          sender.send(markdownPath)
        })

program.parse(process.argv)