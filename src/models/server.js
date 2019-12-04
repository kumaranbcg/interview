module.exports = (sequelize, DataTypes) => {
  const PullerServer = sequelize.define(
    "PullerServer",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING
      },
      address: {
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: "servers"
    }
  );

  PullerServer.associate = models => {
    models.PullerServer.hasMany(models.Puller, {
      as: "puller"
    });
  };

  return PullerServer;
};
