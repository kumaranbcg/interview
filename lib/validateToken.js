const jwk = require("../cognito/jwk.json");
let pems = {};
module.exports = {
  validate: token => {
    let jwt = require("jsonwebtoken");
    let jwkToPem = require("jwk-to-pem");
    jwk.keys.forEach(key => {
      pems[key.kid] = jwkToPem(key);
    });
    return new Promise((resolve, reject) => {
      const decodedJwt = jwt.decode(token, { complete: true });
      if (!decodedJwt) {
        console.log("Not a valid JWT token");
        reject(err);
        return;
      }
      // console.log(decodedJwt);
      const kid = decodedJwt.header.kid; 
      const pem = pems[kid];
 
      jwt.verify(token, pem, { algorithms: ["RS256"] }, function(
        err,
        decodedToken
      ) {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(decodedToken);
        }
      });
    });
  }
};
