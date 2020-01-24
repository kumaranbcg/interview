module.exports = (sequelize, DataTypes) => {
  const PathDetection = sequelize.define(
    "PathDetection",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      source_uri: {
        type: DataTypes.STRING,
        allowNull: false
      },
      zone: {
        type: DataTypes.TEXT,
        get: function () {
          if (this.getDataValue("zone")) {
            return JSON.parse(this.getDataValue("zone"));
          } else {
            return {};
          }
        },
        set: function (value) {
          this.setDataValue("zone", JSON.stringify(value));
        }
      }
    },
    {
      underscored: true,
      tableName: "pathDetection"
    }
  );

  PathDetection.associate = models => {
    models.PathDetection.belongsTo(models.User);
  };

  return PathDetection;
};
