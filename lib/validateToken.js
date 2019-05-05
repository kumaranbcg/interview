const jwk = require("../cognito/jwk.json");

module.exports = {
  validate: token => {
    let jwt = require("jsonwebtoken");
    let jwkToPem = require("jwk-to-pem");
    let pem = jwkToPem(jwk);
    return new Promise((resolve, reject) => {
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
