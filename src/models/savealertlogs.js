module.exports = (sequelize, DataTypes) => {
  const saveAlertLogs = sequelize.define(
    "saveAlertLogs",
    {
      // attributes
      id: {
        type: DataTypes.BIGINT(11) ,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      alert_id: {
        type: DataTypes.STRING
      },
      detection_id: {
        type: DataTypes.STRING
      },
      user_id: {
        type: DataTypes.INTEGER
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
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    },
    {
      underscored: true,
      tableName: "notification_sent_logs"
      // options
    }
  );

  return saveAlertLogs;
};
