const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Monitor = require("./monitor");
const Vod = require("./vod");
const Detection = sequelize.define(
  "detection",
  {
    // attributes
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    timestamp: {
      type: Sequelize.DATE
    },
    alert: {
      type: Sequelize.BOOLEAN
    },
    result: {
      type: Sequelize.TEXT,
      get: function() {
        return JSON.parse(this.getDataValue("result"));
      },
      set: function(value) {
        this.setDataValue("result", JSON.stringify(value));
      }
    },
    monitor_id: {
      type: Sequelize.STRING
    },
    engine: {
      type: Sequelize.STRING
    },
    image_url: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true
    // options
  }
);

Detection.belongsTo(Monitor);

module.exports = Detection;
