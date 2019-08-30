const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Configuration = sequelize.define(
  "configuration",
  {
    // attributes
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    config: {
      type: Sequelize.TEXT,
      get: function() {
        return JSON.parse(this.getDataValue("config"));
      },
      set: function(value) {
        this.setDataValue("config", JSON.stringify(value));
      }
    },
    monitor_id: {
      type: Sequelize.STRING
    },
    engine: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true
  }
);
module.exports = Configuration;
