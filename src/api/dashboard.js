const express = require("express");
const router = express.Router();

const { Alert } = require("../lib/db");
const { today,yesterday } = require("../lib/utils");

const { Op } = require("sequelize");

router.get('/', async (req, res) => {
  try {

    const query = {
      where: {},
    };

    if (req.query.monitor_id) {
      query.monitor_id = req.query.monitor_id;
    }

    const todayDate = today();
    const yesterdayDate = yesterday();

    const alertAll = await Alert.findAndCountAll({
      ...query, where: {
      }
    });

    const alert = await Alert.findAndCountAll({
      ...query, where: {
        createdAt: todayDate
      }
    });

    const alertYesterday = await Alert.findAndCountAll({
      ...query, where: {
        createdAt: yesterdayDate
      }
    });


    const data = {

      safetyStat: [
        {
          title: "Alerts Today",
          percent: { value: alertAll.count + alert.count / 2, profit: Boolean(alertYesterday.count + alert.count / 2) },
          total: {
            value: alertAll.count,
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: alertYesterday.count + alert.count / 2, profit: false
          },
          options: [
            {
              text: "Daily",
              value: "daily"
            },
            {
              text: "Weekly",
              value: "weekly"
            },
            {
              text: "Monthly",
              value: "monthly"
            }
          ],
          chartColor: "#2b518e"
        },
        {
          title: "Safety Level",
          percent: { value: 0, profit: false },
          total: {
            value: alert.count,
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 0, profit: false
          },
          chartColor: "#ffa630"
        },
        {
          title: "Savings on Monitoring",
          percent: { value: 0, profit: false },

          total: {
            value: alert.count,
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 0, profit: false
          },
          background: "#ffa630",
          color: "#fff",
          chartColor: "#FFF"
        }
      ],
      savingsStat: [
        {
          title: "Minutes Monitored",
          percent: { value: 0, profit: false },

          total: {
            value: alert.count,
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 0, profit: false
          },
          options: [
            {
              text: "Daily",
              value: "daily"
            },
            {
              text: "Weekly",
              value: "weekly"
            },
            {
              text: "Monthly",
              value: "monthly"
            }
          ],
          chartColor: "#2b518e"
        },
        {
          title: "Best Day", percent: { value: 0, profit: false },

          total: {
            value: alert.count,
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 0, profit: false
          },
          chartColor: "#2b518e"
        },
        {
          title: "Worst Day", percent: { value: 0, profit: false },
          total: {
            value: alert.count,
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 0, profit: false
          },
          chartColor: "#2b518e"
        }
      ],
    }
    res
      .send(data)
      .status(200)
      .end();

  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;
