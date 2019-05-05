const cognitoValidate = require("../lib/validateToken");

module.exports = {
  verify: (req, res, next) => {
    let token = req.headers["authorization"];
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    if (token) {
      cognitoValidate
        .validate(token)
        .then(user => {
          req.body.user = user;
          next();
        })
        .catch(err => {
          return res.json({
            success: false,
            message: "Auth token is not valid"
          });
        });
    } else {
      return res.json({
        success: false,
        message: "Auth token is not supplied"
      });
    }
  }
};
