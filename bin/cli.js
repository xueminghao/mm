#!/usr/bin/env node

const configurator = require('./packages/lib/configurator')
const sender = require('./packages/lib/sender')
const chalk = require('chalk')

const program = require('commander')
program.version('1.0.2')

program.command('init')
        .description('Init mm')
        .action(function () {
          configurator.initConfiguration()
        })
program.command('config')
        .description('Config mm')
        .option('-s, --service <service>', 'Config the SMTP service')
        .option('-f, --from <from>', 'Config the from address')
        .option('-t, --to <to...>','Config the to addresses, multi addresses can be seperated by commas')
        .option('-b, --subject <subject>', 'Config the subject')
        .option('-p, --password <password>', 'Config password')
        .action(function (options) {
          if (!configurator.isConfigurationValid()) {
            console.log(chalk.red('Please set up your email configuration use mm init first!'))
            program.help()
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
program.command('send <path>')
        .description('send email')
        .action(function (path) {
          if (!configurator.isConfigurationValid()) {
            console.log(chalk.red('Please set up your email configuration use mm init first!'))
            program.help()
          }
          sender.send(path)
        })

program.parse(process.argv)