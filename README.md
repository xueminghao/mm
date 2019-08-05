# markdown-mailer

![npm](https://img.shields.io/npm/v/markdown-mailer)

Markdown-mailer is a cli tool written in Javascript to send your mail written in markdown. It's based on some popular JS packages such as ```showdown``` and ```nodemailer```. After you finished the config process, you can send your markdown just with a simple ``` mm send <markdown-path>``` command.

# Installation

## npm
```
npm install -g markdown-mailer
```

## yarn
```
yarn global add markdown-mailer
```

# Usage

## config
Before you can use markdown-mailer to send email, you must set up it with some basic information such as which smtp service you want to use, the from and to address, etc. Run ```mm config -h``` to see the full options you can use with markdown-mailer as follows:

```
Usage: config [options]

Config mm

Options:
  -l, --list                 list the current configuration
  -s, --service <service>    config the SMTP service you will use to send your email
  -f, --from <from>          config the from address
  -t, --to <to...>           config the to addresses, multi addresses should be seperated by commas
  -b, --subject <subject>    config the subject
  -p, --password <password>  config password. Note it is the app specific password not the account password. For example if you are using gmail service, you can check this link for help: https://support.google.com/accounts/answer/185833?hl=en
  -h, --help                 output usage information
```

Use ```mm init``` to initialize the configuration, or use ```mm config``` to update it.

## send

Use ``` mm send <markdown-path>``` to send the specified markdown mail.

## help

Use ``` mm -h``` to see more detailed information
# Samples

```
mm send 2019-08-02.md
```