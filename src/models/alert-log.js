module.exports = (sequelize, DataTypes) => {
  const AlertLog = sequelize.define(
    "AlertLog",
    {
      // attributes
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      }
    },
    {
      underscored: true,
      tableName: "alert_logs"
      // options
    }
  );

  AlertLog.associate = models => {
    models.AlertLog.belongsTo(models.Alert, {
      foreignKey: "alert_id",
      as: "alert"
    });
  };

  return AlertLog;
};
