module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        required: true
      },
      email: {
        type: DataTypes.STRING,
        required: true
      },
      password: {
        type: DataTypes.STRING,
        required: true
      },
      role: {
        type: DataTypes.ENUM,
        values: ["user", "admin"]
      },
      disabled: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      underscored: true,
      tableName: "users"
    }
  );

  User.associate = models => {
    models.User.hasMany(models.Monitor);
  };

  return User;
};
