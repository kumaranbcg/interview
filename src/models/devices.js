module.exports = (sequelize, DataTypes) => {
  const Devices = sequelize.define(
    "Devices",
    {
      // attributes
      id: {
        type: DataTypes.STRING,
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
      tableName: "devices"
      // options
    }
  );

  return Devices;
};