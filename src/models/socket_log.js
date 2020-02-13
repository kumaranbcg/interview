module.exports = (sequelize, DataTypes) => {
  const SocketLog = sequelize.define(
    "SocketLog",
    {
      // attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      socket_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      time_in: {
        type: DataTypes.DATE
      },
      time_out: {
        type: DataTypes.DATE
      },
      camera_id: {
        type: DataTypes.STRING
      },
    },
    {
      underscored: true,
      tableName: "socket_log"
      // options
    }
  );

  // SocketLog.associate = models => {
  //   models.SocketLog.belongsTo(models.User);
  //   models.SocketLog.hasMany(models.Detection, {
  //     as: "detection"
  //   });
  //   models.SocketLog.hasMany(models.Puller, {
  //     as: "puller"
  //   });
  // };

  return SocketLog;
};
