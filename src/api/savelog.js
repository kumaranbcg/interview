const { saveAlertLogs } = require("../lib/db");

module.exports = {
  save:async ( body ) => {
    try {
      await saveAlertLogs.create({
        body
      });
      return
    } catch (err) {
      console.log(err);
      return
    }
  }
}