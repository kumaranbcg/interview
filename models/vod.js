const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Vod = sequelize.define(
  "monitor",
  {
    // attributes
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    monitor_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    mp4_url: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true
    // options
  }
);

module.exports = Vod;
