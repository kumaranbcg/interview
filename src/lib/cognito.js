const AWS = require('../lib/aws')
const s3 = new AWS.S3();
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const USER_POOL = 'ap-southeast-1_vUjO2Mocs';


module.exports = {
  USER_POOL,
  cognitoidentityserviceprovider,
}