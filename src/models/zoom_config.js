module.exports = (sequelize, DataTypes) => {
  const ZoomConfig = sequelize.define(
    "ZoomConfig",
    {
      // attributes
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      config: {
        type: DataTypes.TEXT,
        get: function () {
          if (this.getDataValue("config")) {
            return JSON.parse(this.getDataValue("config"));
          } else {
            return {};
          }
        },
        set: function (value) {
          this.setDataValue("config", JSON.stringify(value));
        }
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
