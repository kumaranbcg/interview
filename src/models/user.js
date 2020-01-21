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
      firstname: {
        type: DataTypes.STRING,
      },
      surname: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        required: true
      },
      email: {
        type: DataTypes.STRING,
        required: true
      },
      phone: {
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
      },
      permissions: {
        type: DataTypes.TEXT,
        get: function () {
          if (this.getDataValue("permissions")) {
            return JSON.parse(this.getDataValue("permissions"));
          } else {
            return {};
          }
        },
        set: function (value) {
          this.setDataValue("permissions", JSON.stringify(value));
        }
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
