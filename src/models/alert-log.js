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
      tableName: "detections"
      // options
    }
  );

  AlertLog.associate = models => {
  };

  return AlertLog;
};
