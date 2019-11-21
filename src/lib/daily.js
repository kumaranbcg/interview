const Alert = require("../models/alert");
const Monitor = require("../models/monitor");
const Detection = require("../models/detection");
const { Op } = require("sequelize");

module.exports = {
  getAlerts: async () => {
    const alerts = await Alert.findAll({
      where: {
        type: "Interval"
      },
      include: [
        {
          model: Monitor,
          as: "monitor",
          include: {
            model: Detection,
            as: "detection",
            where: {
              createdAt: {
                [Op.lte]: new Date(),
                [Op.gte]: new Date() - 24 * 3600 * 1000
              }
            }
          }
        }
      ]
    });
    return alerts;
  }
};
