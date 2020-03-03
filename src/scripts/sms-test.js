const accountSid = 'AC3374d3a92b109427519a0eb01435806f';
const authToken = '6f05338cdc990f3ee3de7b0e23a27eff';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is a test sms from Donald',
     from: '+13526334065',
     to: '+8613682664411'
   })
  .then(message => console.log(message.sid));