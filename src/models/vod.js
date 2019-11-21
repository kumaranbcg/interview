module.exports = (sequelize, DataTypes) => {
  const Vod = sequelize.define(
    "Vod",
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
      flv_url: {
        type: DataTypes.STRING
      },
      thumbnail_url: {
        type: DataTypes.STRING
      },
      start_timestamp: {
        type: DataTypes.DATE
      },
      end_timestamp: {
        type: DataTypes.DATE
      }
    },
    {
      underscored: true,
      tableName: "vods"
      // options
    }
  );

  Vod.associate = models => {
    models.Vod.belongsTo(models.Monitor, {
      foreignKey: "monitor_id",
      as: "monitor"
    });
  };

  return Vod;
};
