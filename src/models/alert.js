module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define(
    "Alert",
    {
      // attributes
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING
      },
      engine: {
        type: DataTypes.STRING
      },
      interval: {
        type: DataTypes.INTEGER
      },
      output_type: {
        type: DataTypes.STRING
      },
      output_address: {
        type: DataTypes.STRING
      },
      trigger_record: {
        type: DataTypes.BOOLEAN
      },
      alert_type: {
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: "alerts"
      // options
    }
  );

  Alert.associate = models => {
    models.Alert.belongsTo(models.Monitor, {
      foreignKey: "monitor_id",
      as: "monitor"
    });
  };

  return Alert;
};
