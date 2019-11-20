module.exports = (sequelize, DataTypes) => {
  const Configuration = sequelize.define(
    "Configuration",
    {
      // attributes
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      config: {
        type: DataTypes.TEXT,
        get: function() {
          return JSON.parse(this.getDataValue("config"));
        },
        set: function(value) {
          this.setDataValue("config", JSON.stringify(value));
        }
      },
      monitor_id: {
        type: DataTypes.STRING
      },
      engine: {
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: "configurations"
    }
  );

  return Configuration;
};
