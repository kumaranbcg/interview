module.exports = (sequelize, DataTypes) => {
  const Puller = sequelize.define(
    "Puller",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM,
        values: ["puller", "recorder"],
        defaultValue: "puller"
      }
    },
    {
      underscored: true,
      tableName: "pullers"
    }
  );

  Puller.associate = models => {
    models.Puller.belongsTo(models.PullerServer, {
      as: "server",
      foreignKey: "server_id"
    });
    models.Puller.belongsTo(models.Monitor, {
      as: "monitor",
      foreignKey: "monitor_id"
    });
  };

  return Puller;
};
