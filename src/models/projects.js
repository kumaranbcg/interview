module.exports = (sequelize, DataTypes) => {
  const Projects = sequelize.define(
    "Projects",
    {
      // attributes
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      project_name: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      quarter: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,

      },
      target: {
        type: DataTypes.INTEGER, allowNull: false,

      },
      period_from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      period_to: {
        type: DataTypes.DATE,
        allowNull: false,

      },
    },
    {
      underscored: true,
      tableName: "projects"
      // options
    }
  );

  Projects.associate = models => {
  };

  return Projects;
};
