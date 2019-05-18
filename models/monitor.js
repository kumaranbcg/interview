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
