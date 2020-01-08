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
      },
      quarter: {
        type: DataTypes.STRING,
      },
      capacity: {
        type: DataTypes.INTEGER,
      },
      target: {
        type: DataTypes.INTEGER
      },
      period: {
        type: DataTypes.STRING
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
