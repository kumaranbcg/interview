const express = require("express");
const authentication = require("../middleware/authentication");
const shortid = require("shortid");
const router = express.Router();

const { Vod, Detection, Monitor, Puller, PullerServer, Alert } = require("../lib/db");

const axios = require("axios");
const url = require("url");
const { Op } = require("sequelize");

const today = () => {
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);
  return {
    [Op.gte]: start,
    [Op.lte]: end
  };
}


const yesterday = () => {
  var start = new Date(new Date().getDate() - 1);
  start.setHours(0, 0, 0, 0);

  var end = new Date(new Date().getDate() - 1);
  end.setHours(23, 59, 59, 999);
  return {
    [Op.gte]: start,
    [Op.lte]: end
  };
}




router.get('/', async (req, res) => {
  try {

    const query = {
      where: {},
    };

    if (req.query.monitor_id) {
      query.monitor_id = req.query.monitor_id;
    }


    const alert = await Alert.findAndCountAll({
      ...query, where: {
        createdAt: today()
      }
    });

    const alertYesterday = await Alert.findAndCountAll({
      ...query, where: {
        createdAt: yesterday()
      }
    });


    const data = {

      safetyStat: [
        {
          product: "Alerts Today",
          total: {
            daily: alert.count,
            percent: { value: 3.7, profit: false }
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 4.5, profit: false
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
          product: "Safety Level",
          total: {
            daily: alert.count,
            percent: { value: 3.7, profit: false }
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 4.5, profit: false
          },
          chartColor: "#ffa630"
        },
        {
          product: "Savings on Monitoring",
          total: {
            daily: alert.count,
            percent: { value: 3.7, profit: false }
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 4.5, profit: false
          },
          background: "#ffa630",
          color: "#fff",
          chartColor: "#FFF"
        }
      ],
      savingsStat: [
        {
          product: "Minutes Monitored",
          total: {
            daily: alert.count,
            percent: { value: 3.7, profit: false }
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 4.5, profit: false
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
          product: "Best Day",
          total: {
            daily: alert.count,
            percent: { value: 3.7, profit: false }
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 4.5, profit: false
          },
          chartColor: "#2b518e"
        },
        {
          product: "Worst Day",
          total: {
            daily: alert.count,
            percent: { value: 3.7, profit: false }
          },
          yesterday: {
            value: alertYesterday.count, profit: false
          },
          average: {
            value: 4.5, profit: false
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
})

module.exports = router;
