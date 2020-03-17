module.exports = (sequelize, DataTypes) => {
  const NotificationSentLog = sequelize.define(
    "NotificationSentLog",
    {
      // attributes
      id: {
        type: DataTypes.BIGINT(11) ,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      output_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      output_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      output_detail: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      underscored: true,
      tableName: "notification_sent_logs"
      // options
    }
  );

  NotificationSentLog.associate = models => {
    models.NotificationSentLog.belongsTo(models.Alert, {
      foreignKey: "alert_id",
      as: "alert"
    });
    models.NotificationSentLog.belongsTo(models.Detection, {
      foreignKey: "detection_id",
      as: "detection"
    });
    models.NotificationSentLog.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user"
    });
  };

  return NotificationSentLog;
};
