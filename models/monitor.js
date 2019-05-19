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
    connectionUri: {
      type: Sequelize.STRING
    }
  },
  {
    // options
  }
);

module.exports = Monitor;
