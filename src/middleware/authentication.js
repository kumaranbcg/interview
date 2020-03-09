const cognitoValidate = require("../lib/validateToken");
const Token = require("../lib/token");
const { User } = require("../lib/db");
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
    } else if (token && token.startsWith("Bearer ")) {
      let token = req.headers["authorization"];
      let jwt;
      // Remove Bearer from string
      jwt = token.slice(7, token.length);
      try {
        Token.validate(jwt);
        const user = Token.decode(jwt);
        req.user = user;
        next();
      } catch (err) {
        res.status(401).json({
          success: false,
          message: err
        });
      }
    } else {
      res.status(402).json({
        success: false,
        message: "Auth token is not supplied"
      });
    }
  },

  verifyViact: (req, res, next) => {
    let token = req.headers["authorization"];
    let jwt;
    if (token && token.startsWith("Bearer ")) {
      // Remove Bearer from string
      jwt = token.slice(7, token.length);
      try {
        Token.validate(jwt);
        const user = Token.decode(jwt);
        req.user = user;
        next();
      } catch (err) {
        res.status(402).json({
          success: false,
          message: err
        });
      }
    } else {
      res.status(402).json({
        success: false,
        message: "Auth token is not supplied"
      });
    }
  },

  checkAdmin: async (req, res, next) => {
    const user = await User.findOne({
      where: {
        username: req.user["cognito:username"]
      }
    });
    if (user) {
      next();
    } else {
      return res.status(400).end();
    }
  }
};
