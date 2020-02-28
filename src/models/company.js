module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      // attributes
      id: {
        type: DataTypes.BIGINT(11) ,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sms_frequency: {
        type: DataTypes.BIGINT(11) ,
        allowNull: false,
      },
      email_frequency: {
        type: DataTypes.BIGINT(11) ,
        allowNull: false,
      }
    },
    {
      underscored: true,
      tableName: "companies"
      // options
    }
  );

  return Company;
};
