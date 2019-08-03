# markdown-mailer

![npm](https://img.shields.io/npm/v/markdown-mailer)

Markdown-mailer is a Javascript tool to send your mail written in markdown. It's based on some popular JS packages such as ```showdown``` and ```nodemailer```.

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
Before you can use markdown-mailer to send email, you must set up it some basic information such as which smtp service you want to use, the from and to address you want to use, etc.

Use ```mm init``` to initialize the configuration, or use ```mm config``` to update it.

## send

Use ``` mm send <path>``` to send the specified markdown mail.

## help

Use ``` mm -h``` to see more detailed information
# Samples

```
    mm send 2019-08-02.md
```