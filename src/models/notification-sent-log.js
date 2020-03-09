module.exports = (sequelize, DataTypes) => {
  const NotificationSentLog = sequelize.define(
    "NotificationSentLog",
    {
      // attributes
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      output_type: {
        type: DataTypes.STRING
      },
      output_address: {
        type: DataTypes.STRING
      },
      output_detail: {
        type: DataTypes.STRING
      },
    },
    {
      underscored: true,
      tableName: "notification_sent_logs"
    }
  );

  NotificationSentLog.associate = models => {
    models.NotificationSentLog.belongsTo(models.Alert, {
      foreignKey: "alert_id",
      as: "alert"
    });
    models.NotificationSentLog.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
    models.NotificationSentLog.belongsTo(models.Detection, {
      foreignKey: "detection_id",
      as: "detection"
    });
  };

  return NotificationSentLog;
};
