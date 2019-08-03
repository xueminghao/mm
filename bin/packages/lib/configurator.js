const inquirer = require('inquirer')
const fs = require('fs')
const shell = require('shelljs')
const os = require('os')
const path = require('path')

const mmConfigHome = path.join(os.homedir(), '.mm')
const mmConfigFile = path.join(mmConfigHome, 'configuration.json')

let configuration = null
readConfiguration()

function isConfigurationValid() {
    return configuration !== null 
}

function readConfiguration() {
    try {
        const content = fs.readFileSync(mmConfigFile)
        const json = JSON.parse(content)
        configuration = json
    } catch (error) {
        
    }
}

function syncConfigurationToDisk() {
    const content = JSON.stringify(configuration)
    fs.writeFileSync(mmConfigFile, content)
}

function startInitInquirerProcess() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'smtp_server',
            message: 'Please select your SMTP server:',
            choices: [
                'gmail',
                'qq',
            ]
        },
        {
            type: 'input',
            name: 'from',
            message: 'Input the address used to send the email:',
        },
        {
            type: 'input',
            name: 'to',
            message: 'Input the recipients(seperated by commas):',
        },
        {
            type: 'password',
            name: 'password',
            message: 'Input your application specific password:'
        },
        {
            type: 'input',
            name: 'subject',
            message: 'Input the subject:'
        }
    ]).then(answers => {
        configuration = {}
        if (shell.test('-d', mmConfigHome)) {
            shell.rm('-rf', mmConfigHome)
        }
        shell.mkdir(mmConfigHome)
        shell.touch(mmConfigFile)
        if (typeof answers.smtp_server !== 'undefined') {
            configuration.smtp_server = answers.smtp_server
        }
        if (typeof answers.from !== 'undefined') {
            configuration.from = answers.from
        }
        if (typeof answers.to !== 'undefined') {
            configuration.to = answers.to
        }
        if (typeof answers.password !== 'undefined') {
            configuration.password = answers.password
        }
        if (typeof answers.subject !== 'undefined') {
            configuration.subject = answers.subject
        }
        syncConfigurationToDisk()
    })
}
function initConfiguration() {
    if (configuration !== null) {
        inquirer.prompt({
            type: 'confirm',
            name: 're-init',
            message: 'There\'s a configuration file already exists, do you really want to remove and create a new one?'
        }).then(answers => {
            if (answers['re-init'] === true) {
                startInitInquirerProcess()
            }
        })
    } else {
        startInitInquirerProcess()
    }
}

function updateConfiguration(key, value) {
    if (configuration) {
        configuration[key] = value
        syncConfigurationToDisk()
    } else {
        console.log('Please flow below steps to init your configuration first')
        init()
    }
}

module.exports = {
    isConfigurationValid,
    configuration,
    initConfiguration,
    updateConfiguration
}