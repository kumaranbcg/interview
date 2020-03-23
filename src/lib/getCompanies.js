const {Company, NotificationSentLog} = require("./db");
const { Op } = require("sequelize");
const moment = require('moment');

module.exports = {
  getCompanies: async (company_code) => {
    const company = await Company.findOne({
      where: {
        company_code: company_code
      },
    });
    // console.log(moment().format("YYYY MM DD HH"))
    // console.log(moment().add("hour", 1).format("YYYY MM DD HH"))
    const start = moment("2020-03-08 23:02:45").format("YYYY-MM-DD HH:00:00"), end=moment("2020-03-08 23:02:45").add(1,"hour").format("YYYY-MM-DD HH:00:00")
    const logs = await NotificationSentLog.findAll({
      where:{
        user_id:company_code,
        created_at:{[Op.between]: [moment("2020-03-08 23:02:45").format("YYYY-MM-DD HH:00:00"), moment("2020-03-08 23:02:45").add(1,"hour").format("YYYY-MM-DD HH:00:00")]}
      }
    })
    console.log(logs)
    return company;
  }
};
