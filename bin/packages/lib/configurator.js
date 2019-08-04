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
    inquirer.prompt(
        {
            type: 'list',
            name: 'smtp_service',
            message: 'Please select your SMTP service:',
            choices: [
                'gmail',
                'qq',
                'other',
            ]
        }
    ).then(answers => {
        if (answers.smtp_service === 'other') {
            inquirer.prompt({
                type: 'input',
                name: 'smtp_custom_service',
                message: 'Please input your custom service:',
            }).then(answers => {
                continueInitInquirerProcessWithService(answers.smtp_custom_service)
            })
        } else {
            continueInitInquirerProcessWithService(answers.smtp_service)
        }
    })
}

function continueInitInquirerProcessWithService(smtp_service) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'from',
            message: 'Please input the address used to send the email:',
        },
        {
            type: 'input',
            name: 'to',
            message: 'Please input the recipients(seperated by commas):',
        },
        {
            type: 'password',
            name: 'password',
            message: 'Please input your application specific password(note it\'s not your account password):'
        },
        {
            type: 'input',
            name: 'subject',
            message: 'Please input the subject:'
        },
        {
            type: 'confirm',
            name: 'isReply',
            message: 'Should treat your email a reply of the specific subject? This may keep your email in a single thread.'
        }
    ]).then(answers => {
        configuration = {}
        if (shell.test('-d', mmConfigHome)) {
            shell.rm('-rf', mmConfigHome)
        }
        shell.mkdir(mmConfigHome)
        shell.touch(mmConfigFile)
        if (typeof smtp_service !== 'undefined') {
            configuration.smtp_service = smtp_service
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
            let subject = answers.subject
            if (answers.isReply === true) {
                subject = 'Re: ' + subject
            }
            configuration.subject = subject
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