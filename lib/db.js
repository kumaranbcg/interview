const Sequelize = require("sequelize");

// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "./test.sqlite"
// });

const sequelize = new Sequelize("customindz", "customindz", "Customindz2019", {
  dialect: "mysql",
  host: "customindz.cfvqlp7ufmv9.ap-east-1.rds.amazonaws.com",
  logging: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    sequelize.sync();
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
