const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

let sequelize;

if (process.env.NODE_ENV === "local") {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "./db/customindz.sqlite",
        logging: false,
        timezone: '+08:00'
    });
} else {
    sequelize = new Sequelize("customindz", "customindz", "Customindz2019", {
        dialect: "mysql",
        host: "customindz.cfvqlp7ufmv9.ap-east-1.rds.amazonaws.com",
        logging: false,
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
        },
        timezone: 'Asia/Hong_Kong',
    });
}

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
        sequelize.sync();
    })
    .catch(err => {
        console.error("Unable to connect to the database:", err);
    });

const db = {};

fs.readdirSync(path.join(__dirname, "..", "models")).forEach(file => {
    var model = sequelize["import"](path.join(__dirname, "..", "models", file));
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;