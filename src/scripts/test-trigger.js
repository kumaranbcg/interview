const axios = require("axios");

axios.post(
  "http://127.0.0.1:3000/api/admin/detection/incoming",
  {
    monitor_id: "tuspark-roof",
    objects: {},
    alert: ["N"]
  },
  {
    headers: {
      "x-customindz-key": "customindz"
    }
  }
);
