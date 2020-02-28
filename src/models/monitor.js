module.exports = (sequelize, DataTypes) => {
  const Monitor = sequelize.define(
    "Monitor",
    {
      // attributes
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
      connection_uri: {
        type: DataTypes.STRING,
        allowNull: false
      },
      play_from_source: {
        type: DataTypes.BOOLEAN
      },
      recording: {
        type: DataTypes.BOOLEAN
      },
      type: {
        type: DataTypes.STRING
      },
      device_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      machine_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true
      },
      socket_id: {
        type: DataTypes.STRING
      },
      time_in: {
        type: DataTypes.DATE
      },
      time_out: {
        type: DataTypes.DATE
      },
      engines: {
        type: DataTypes.TEXT,
        get: function () {
          if (this.getDataValue("engines")) {
            return JSON.parse(this.getDataValue("engines"));
          } else {
            return [];
          }
        },
        set: function (value) {
          this.setDataValue("engines", JSON.stringify(value));
        }
      },
      graph: {
        type: DataTypes.TEXT,
        get: function () {
          if (this.getDataValue("graph")) {
            return JSON.parse(this.getDataValue("graph"));
          } else {
            return [];
          }
        },
        set: function (value) {
          this.setDataValue("graph", JSON.stringify(value));
        }
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
      },
      config: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      underscored: true,
      tableName: "monitors"
      // options
    }
  );

  Monitor.associate = models => {
    models.Monitor.belongsTo(models.User);
    models.Monitor.hasMany(models.Detection, {
      as: "detection"
    });
    models.Monitor.hasMany(models.Puller, {
      as: "puller"
    });
  };

  return Monitor;
};
