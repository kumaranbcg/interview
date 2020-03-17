const cognitoValidate = require("../lib/validateToken");
const Token = require("../lib/token");
const { User } = require("../lib/db");
const { USER_POOL, cognitoidentityserviceprovider } = require('../lib/cognito')


const getUser = (email) => {
  return new Promise((resolve, reject) => {
    var params = {
      UserPoolId: USER_POOL,
      Filter: "email = \"" + email + "\"",
    };
    cognitoidentityserviceprovider.listUsers(params, async function (err, data) {
      if (data && data.Users.length) {
        const users = data.Users.map(user => {
          const response = {
            username: user.Username
          }
          user.Attributes.forEach(obj => {
            response[obj.Name.replace('custom:', '')] = obj.Value
          })
          return response;
        })
        return resolve(users[0]);
      }
      reject(err)

    })
  })
}

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
          .then(async user => {
            const userData = await getUser(user.email);
            req.user = { ...user, ...userData };
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
    let token = req.headers["authorization"];

    if (req.headers["x-customindz-key"] === "customindz") {
      next();
    } else if (token && token.startsWith("Bearer ")) {
      let jwt;
      jwt = token.slice(7, token.length);
      cognitoValidate
        .validate(jwt)
        .then(async user => {
          const userData =await getUser(user.email);
          req.user = { ...user, ...userData };
          next();
        })
        .catch(err => {
          res.json({
            success: false,
            message: err
          });
        });
    } else {
      res.status(402).json({
        success: false,
        message: "Auth token is not supplied"
      });
    }
  },

  verifyViact: async (req, res, next) => {
    let token = req.headers["authorization"];
    let jwt;
    if (token && token.startsWith("Bearer ")) {
      // Remove Bearer from string
      jwt = token.slice(7, token.length);
      try {
        Token.validate(jwt);
        const user = Token.decode(jwt);
        const userData = await getUser(user.email);
        req.user = { ...user, ...userData };
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
  },
  getUser
};
