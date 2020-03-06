module.exports = (sequelize, DataTypes) => {
  const NotificationLogs = sequelize.define(
    "NotificationLogs",
    {
      // attributes
      id: {
        type: DataTypes.BIGINT(11) ,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      alert_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
      },
      detection_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
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
      },
      created_at: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      updated_at: {
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

  // NotificationLogs.associate = models => {
  //   models.NotificationLogs.belongsTo(models.Alert, {
  //     foreignKey: "alert_id",
  //     as: "alert"
  //   });
  // };

  return NotificationLogs;
};
