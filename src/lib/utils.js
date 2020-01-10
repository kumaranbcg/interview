const { Op } = require("sequelize");

exports.today = () => {
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);
  return {
    [Op.gte]: start,
    [Op.lte]: end
  };
}


exports.yesterday = () => {
  var start = new Date(new Date().getDate() - 1);
  start.setHours(0, 0, 0, 0);

  var end = new Date(new Date().getDate() - 1);
  end.setHours(23, 59, 59, 999);
  return {
    [Op.gte]: start,
    [Op.lte]: end
  };
}
