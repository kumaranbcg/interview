module.exports = (sequelize, DataTypes) => {
  const Detection = sequelize.define(
    "Detection",
    {
      // attributes
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      timestamp: {
        type: DataTypes.DATE
      },
      alert: {
        type: DataTypes.BOOLEAN
      },
      unread: {
        type: DataTypes.BOOLEAN
      },
      truck_capacity: {
        type: DataTypes.INTEGER
      },
      result: {
        type: DataTypes.TEXT,
        get: function() {
          if (this.getDataValue("result")) {
            return JSON.parse(this.getDataValue("result"));
          } else {
            return [];
          }
        },
        set: function(value) {
          this.setDataValue("result", JSON.stringify(value));
        }
      },
      monitor_id: {
        type: DataTypes.STRING
      },
      engine: {
        type: DataTypes.STRING
      },
      image_url: {
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: "detections"
      // options
    }
  );

  Detection.associate = models => {
    models.Detection.belongsTo(models.Monitor, {
      as: "monitor"
    });
  };

  return Detection;
};
