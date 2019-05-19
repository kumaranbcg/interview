const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Monitor = require("./monitor");
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
      type: Sequelize.TIME
    },
    alert: {
      type: Sequelize.BOOLEAN
    },
    result: {
      type: Sequelize.TEXT,
      get: function() {
        return JSON.parse(this.getDataValue("value"));
      },
      set: function(value) {
        this.setDataValue("value", JSON.stringify(value));
      }
    }
  },
  {
    underscored: true
    // options
  }
);

Detection.belongsTo(Monitor);

module.exports = Detection;
