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
      type: Sequelize.STRING,
      allowNull: false
    },
    connection_uri: {
      type: Sequelize.STRING,
      allowNull: false
    },
    play_from_source: {
      type: Sequelize.BOOLEAN
    },
    engines: {
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

module.exports = Monitor;
