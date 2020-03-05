const express = require("express");
const router = express.Router();
const { NotificationSentLog, Alert, Detection, User } = require("../lib/db");

router.get("/", async (req, res) => {
  try {
    let query = {
      offset: 0
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

    const data = await NotificationSentLog.findAndCountAll(query);
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

router.get("/:id", async (req, res) => {
  try {
    const data = await NotificationSentLog.findOne({
      include: [
        {
          model: Alert,
          as: "alert",
          required: true
        },
        {
          model: Detection,
          as: "detection",
          required: true
        },
        {
          model: User,
          as: "user",
          required: true
        }
      ],
      where: {
        id: req.params.id
      }
    });
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

router.put("/:id", async (req, res, next) => {
  try {
    const notification = await NotificationSentLog.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!notification) {
      return res.status(400).json({
        success: false,
        message: "Notification doesn't exists"
      })
    }
    await NotificationSentLog.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({
      message: "Successfully Updated Notification"
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
    const notification = await NotificationSentLog.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!notification) {
      return res.status(400).json({
        success: false,
        message: "Notification doesn't exists"
      })
    }
    await NotificationSentLog.destroy({
      where: {
        id: req.params.id
      }
    });
    res
      .json({
        message: "Successfully Deleted Notification Send Log"
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

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (body.alert_id) {
      const alert = await Alert.findOne({
        where: {
          id: body.alert_id
        }
      });
      if (!alert) {
        return res.status(400).json({
          success: false,
          message: "Alert doestn't exists"
        })
      }
    }
    if (body.user_id) {
      const user = await User.findOne({
        where: {
          id: body.user_id
        }
      });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User doestn't exists"
        })
      }
    }
    if (body.detection_id) {
      const detection = await Detection.findOne({
        where: {
          id: body.detection_id
        }
      });
      if (!detection) {
        return res.status(400).json({
          success: false,
          message: "Detection doestn't exists"
        })
      }
    }
    const notificationSentLog = await NotificationSentLog.create(req.body)
    res.send({
      id: notificationSentLog.id,
      message: "Successfully Added Notification"
    })
      .status(200)
      .end();
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(err)
  }
})

module.exports = router;
