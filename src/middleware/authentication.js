const cognitoValidate = require("../lib/validateToken");

module.exports = {
  verify: (req, res, next) => {
    if (process.env.NODE_ENV === "local") {
      if (req.headers["x-customindz-key"] === "customindz") {
        req.user = {
          "cognito:username": "local"
        };
        next();
      } else {
        res.status(402).end();
      }
    } else {
      let token = req.headers["authorization"];
      let jwt;
      if (token && token.startsWith("Bearer ")) {
        // Remove Bearer from string
        jwt = token.slice(7, token.length);
        cognitoValidate
          .validate(jwt)
          .then(user => {
            req.user = user;
            next();
          })
          .catch(err => {
            res.json({
              success: false,
              message: err
            });
          });
      } else {
        res.json({
          success: false,
          message: "Auth token is not supplied"
        });
      }
    }
  },
  verifyMachine: (req, res, next) => {
    if (req.headers["x-customindz-key"] === "customindz") {
      next();
    } else {
      res.status(402).end();
    }
  }
};
