const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Monitor = require("./monitor");
const Alert = sequelize.define(
  "alert",
  {
    // attributes
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    engine: {
      type: Sequelize.STRING
    },
    interval: {
      type: Sequelize.STRING
    },
    output_type: {
      type: Sequelize.STRING
    },
    output_address: {
      type: Sequelize.STRING
    },
    trigger_record: {
      type: Sequelize.BOOLEAN
    }
  },
  {
    underscored: true
    // options
  }
);

Alert.belongsTo(Monitor, {
  foreignKey: "monitor_id"
});

module.exports = Alert;
