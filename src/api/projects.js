const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

const { Projects, Detection, Monitor } = require("../lib/db");
const { today, week } = require("../lib/utils");
const { USER_POOL, cognitoidentityserviceprovider } = require('../lib/cognito')

router.get('/', async (req, res) => {
  try {
    var params = {
      UserPoolId: USER_POOL,
      Filter: "email = \"" + req.user.email + "\"",
    };
    cognitoidentityserviceprovider.listUsers(params, async function (err, data) {
      if (err) {
        console.log(err)
        return res
          .status(400)
          .send(err)
          .end();
      }

      const users = data.Users.map(user => {
        const response = {
          username: user.Username
        }
        user.Attributes.forEach(obj => {
          response[obj.Name.replace('custom:', '')] = obj.Value
        })
        return response;
      })

      const query = {
        order: [[req.query.orderBy || "createdAt", req.query.direction || "DESC"]],
        where: {
          company_code: [req.user.company_code]
        }
      };

      if (req.query.limit) {
        query.limit = parseInt(req.query.limit);
        if (req.query.page) {
          query.offset =
            (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
        }
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
      const projectsList = await Projects.findAndCountAll(query);

      res.send(projectsList).end();

    });

  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.get('/:id', async (req, res) => {
  try {

    const data = await Projects.findOne({
      where: {
        id: req.params.id,
      }
    });

    if (!data) {
      throw new Error("No Project Found");
    }
    res.send({
      data
    }).end();


  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await Projects.create({
      ...req.body,
      id: shortid(),
      company_code: [req.user.company_code],
      quarter: `${req.body.quarter}`.toUpperCase(),
    });

    res.send(data).end();


  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    delete req.body.id;
    await Projects.update({
      ...req.body,
      quarter: `${req.body.quarter}`.toUpperCase()
    }, {
      where: {
        id: req.params.id,
        company_code: [req.user.company_code]
      }
    });
    res
      .send({
        message: "Successfully Updated Project"
      })
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

router.delete("/:id", async (req, res, next) => {
  try {
    let data = await Projects.destroy({
      where: {
        id: req.params.id,
      }
    });
    res.send({
      message: 'Removed project'
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;
