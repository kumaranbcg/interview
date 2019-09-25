const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Vod = sequelize.define(
  "vod",
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
    flv_url: {
      type: Sequelize.STRING
    },
    thumbnail_url: {
      type: Sequelize.STRING
    },
    start_timestamp: {
      type: Sequelize.DATE
    },
    end_timestamp: {
      type: Sequelize.DATE
    }
  },
  {
    underscored: true
    // options
  }
);

module.exports = Vod;
