const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Monitor = sequelize.define(
  "monitor",
  {
    // attributes
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING
    },
    connection_uri: {
      type: Sequelize.STRING
    }
  },
  {
    underscored: true
    // options
  }
);

module.exports = Monitor;
