module.exports = (sequelize, DataTypes) => {
  const Devices = sequelize.define(
    "Devices",
    {
      // attributes
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      zone1: {
        type: DataTypes.STRING
      },
      zone2: {
        type: DataTypes.STRING
      },
    },
    {
      underscored: true,
      tableName: "devices"
      // options
    }
  );


  Devices.associate = models => {
    models.Devices.belongsTo(models.ZoomConfig, {
      foreignKey: "zone1",
      as: "detectionZone1"
    })

    models.Devices.belongsTo(models.ZoomConfig, {
      foreignKey: "zone2",
      as: "detectionZone2"
    })
  };

  return Devices;
};
