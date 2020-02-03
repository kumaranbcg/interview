module.exports = (sequelize, DataTypes) => {
  const ZoomConfig = sequelize.define(
    "ZoomConfig",
    {
      // attributes
      level: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      p1x1: {
        type: DataTypes.STRING
      },
      p1x2: {
        type: DataTypes.STRING
      },
      p1x3: {
        type: DataTypes.STRING
      },
      p1x4: {
        type: DataTypes.STRING
      },
      p1y1: {
        type: DataTypes.STRING
      },
      p1y2: {
        type: DataTypes.STRING
      },
      p1y3: {
        type: DataTypes.STRING
      },
      p1y4: {
        type: DataTypes.STRING
      },
    },
    {
      underscored: true,
      tableName: "zoom_config"
      // options
    }
  );

  return ZoomConfig;
};
