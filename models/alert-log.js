const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const Alert = require("./alert");
const AlertLog = sequelize.define(
  "alert_log",
  {
    // attributes
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    }
  },
  {
    underscored: true
    // options
  }
);

AlertLog.belongsTo(Alert, {
  foreignKey: "alert_id"
});
module.exports = AlertLog;
