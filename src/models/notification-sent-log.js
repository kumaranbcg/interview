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
      alert_id: {
        type: DataTypes.STRING
      },
      detection_id: {
        type: DataTypes.STRING
      },
      user_id: {
        type: DataTypes.STRING
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

  return NotificationSentLog;
};
