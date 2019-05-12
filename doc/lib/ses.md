# SMS Lib

## Basic Documentation

View AWS official at `https://nodemailer.com/smtp/#1-single-connection`

## Description

The usage

```
const response = await ses.send(email,subject,body)
```

### Input

- `email` the email address to deliver
- `subject` the subject of email
- `body` the body of the email

### Output

- `response` Promise of response

## Detailed Design

### Used lib

`node-mailer`

## Test

Run

```
node scripts/ses.js
```
