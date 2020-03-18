const express = require("express");
const router = express.Router();
const { AlertLog, Alert, Monitor } = require("../lib/db");

router.get("/", async (req, res) => {
  try {
    let query = {
      offset: 0,
      include: [
        {
          model: Alert,
          required: true,
          include: [
            {
              model: Monitor,
              required: true,
              where: {
                company_code: req.user.company_code
              }
            }
          ]
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

    const data = await AlertLog.findAndCountAll(query);

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

module.exports = router;
