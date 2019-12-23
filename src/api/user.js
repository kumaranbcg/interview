const express = require("express");
const md5 = require("blueimp-md5");

const router = express.Router();
const { User } = require("../lib/db");
const ses = require("../lib/ses");

router.get("/", async (req, res, next) => {

  try {
    let query = {
      offset: 0,
      where: {},
      include: [
        {
          model: Monitor,
          required: true,
          as: "monitor",
          where: {
            user_id: req.user["cognito:username"],
            ...(req.query.monitor_id ? { id: req.query.monitor_id } : {})
          }
        }
      ]
    };

    if (req.query.limit) {
      query.limit = req.query.limit;
      if (req.query.page) {
        query.offset = (Math.min(req.query.page) - 1) * req.query.limit;
      }
    }

    if (req.query.orderBy) {
      query.order = [[req.query.orderBy]];
    }


    if (req.query.start_timestamp) {
      query.where.createdAt = {
        [Op.gte]: new Date(parseInt(req.query.start_timestamp))
      };
    }
    if (req.query.end_timestamp) {
      if (!query.where.createdAt) {
        query.where.createdAt = {
          [Op.lte]: new Date(parseInt(req.query.end_timestamp))
        };
      } else {
        query.where.createdAt = {
          ...query.where.createdAt,
          [Op.lte]: new Date(parseInt(req.query.end_timestamp))
        };
      }
    }

    const data = await User.findAll(query);

    res
      .send(data)
      .status(200)
      .end();
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});



router.get("/:id", async (req, res, next) => {
  try {
    var data = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(data);
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newUser = {
      ...req.body,
      role: "user",
      password: md5('password123')
    };

    await User.create(newUser);


    res.status(200).json({
      message: "Successfully Added User"
    });

    console.log(`Viact.AI : Invited by ${req.user["cognito:username"]}`, `Use this password password123 to login to your account`);
    
    ses
      .send(req.body.email, `Viact.AI : Invited by ${req.user["cognito:username"]}`, `Use this password ${newUser.password} to login to your account`)
      .then(() => {
        console.log("Successfully send ses");
      })
      .catch(err => {
        console.log(err);
      });


  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await User.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({
      message: "Successfully Updated"
    });
  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id
      }
    });
    res
      .json({
        message: "Successfully Deleted User"
      })
      .status(200)
      .end();
  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;
