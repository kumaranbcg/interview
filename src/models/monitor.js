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
    recording: {
      type: Sequelize.BOOLEAN
    },
    engines: {
      type: Sequelize.TEXT,
      get: function() {
        if (this.getDataValue("engines")) {
          return JSON.parse(this.getDataValue("engines"));
        } else {
          return [];
        }
      },
      set: function(value) {
        this.setDataValue("engines", JSON.stringify(value));
      }
    },
    graph: {
      type: Sequelize.TEXT,
      get: function() {
        if (this.getDataValue("graph")) {
          return JSON.parse(this.getDataValue("graph"));
        } else {
          return [];
        }
      },
      set: function(value) {
        this.setDataValue("graph", JSON.stringify(value));
      }
    },
    zone: {
      type: Sequelize.TEXT,
      get: function() {
        if (this.getDataValue("zone")) {
          return JSON.parse(this.getDataValue("zone"));
        } else {
          return {};
        }
      },
      set: function(value) {
        this.setDataValue("zone", JSON.stringify(value));
      }
    }
  },
  {
    underscored: true
    // options
  }
);

module.exports = Monitor;
