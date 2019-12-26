const express = require("express");
const md5 = require("blueimp-md5");
const Token = require("../lib/token");
const authentication = require("../middleware/authentication");
const router = express.Router();
const {
  User,
  Sequelize: { Op }
} = require("../lib/db");

router.get(
  "/checkAdmin",
  authentication.verify,
  authentication.checkAdmin,
  (req, res) => {
    res.status(200).end();
  }
);

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: req.body.username
          },
          {
            email: req.body.username
          }
        ]
      }
    });

    if (!user) {
      return res
        .status(400)
        .send({
          code: "UserNotFoundException"
        })
        .end();
    }

    if (user.password === md5(req.body.password)) {
      const returnUser = {
        username: user.username,
        email: user.email,
        role: user.role
      };
      const token = Token.sign(returnUser);
      res
        .status(200)
        .send({
          user: returnUser,
          token
        })
        .end();
    } else {
      return res
        .status(400)
        .send({
          code: "NotAuthorizedException"
        })
        .end();
    }
  } catch (err) {
    res
      .status(500)
      .send(err.message)
      .end();
  }
});

router.post("/me", authentication.verifyViact, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res
      .status(500)
      .send(err.message)
      .end();
  }
});

router.post("/register", async (req, res) => {
  try {
    const existingUsername = await User.findOne({
      where: {
        username: req.body.username
      }
    });
    if (existingUsername) {
      return res
        .status(400)
        .send({
          message: "Username Already Registered"
        })
        .end();
    }

    const existingEmail = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (existingEmail) {
      return res
        .status(400)
        .send({
          message: "Email Already Registered"
        })
        .end();
    }

    const newUser = {
      ...req.body,
      role: "user"
    };

    await User.create({
      ...newUser,
      password: md5(req.body.password)
    });

    const token = Token.sign(newUser);
    res
      .status(200)
      .send({
        user: newUser,
        token
      })
      .end();
  } catch (err) {
    res
      .status(500)
      .send(err.message)
      .end();
  }
});

router.post(
  "/change-password",
  authentication.verifyViact,
  async (req, res) => {
    try {
      const user = await User.findOne({
        where: {
          username: req.user.username
        }
      });
      if (user.password === md5(req.body.oldPassword)) {
        await User.update({
          password: md5(req.body.newPassword)
        });

        res
          .status(200)
          .send({
            message: "Succesfully Updated Password"
          })
          .end();
      } else {
        return res
          .status(400)
          .send({
            message: "Old Password Is Not Right"
          })
          .end();
      }
    } catch (err) {
      res
        .status(500)
        .send(err.message)
        .end();
    }
  }
);

module.exports = router;
