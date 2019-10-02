const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Monitor = require("./monitor");
const Vod = sequelize.define(
  "vod",
  {
    // attributes
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
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

Vod.belongsTo(Monitor, {
  foreignKey: "monitor_id"
});

module.exports = Vod;
