# SMS Lib

## Basic Documentation

View AWS official at `https://docs.aws.amazon.com/zh_cn/sdk-for-javascript/v2/developer-guide/sns-examples-sending-sms.html`

## Description

The usage

```
const response = await sms.send(text,phone)
```

### Input

- `text` the text to send in the sms
- `phone` the phone to deliver the sms

### Output

- `response` Promise of response

## Detailed Design

### Used lib

`aws-sdk`

## Test

Run

```
node scripts/sms.js
```
