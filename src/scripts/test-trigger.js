const axios = require("axios");

axios.post(
  "https://api.customindz.com/api/admin/detection/incoming",
  {
    monitor_id: "tuspark-ys",
    objects: {},
    alert: ["N"]
  },
  {
    headers: {
      "x-customindz-key": "customindz"
    }
  }
);
