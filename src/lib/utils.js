const { Op } = require("sequelize");

exports.today = () => {
  var start = new Date();
  // start.setDate(01)
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



exports.week = () => {
  const curr = new Date();

  var start = new Date(
    curr.setDate(curr.getDate() - 7)
  );
  var end = new Date();
  end.setHours(23, 59, 59, 999);

  return {
    [Op.gte]: start,
    [Op.lte]: end
  };
}

exports.paginate = (array, page_size, page_number) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}