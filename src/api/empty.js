const authentication = require("../middleware/authentication");

module.exports = router => {
  router.get("/all", authentication, (req, res, next) => {
    // Get All For User

    res
      .send("WIP")
      .status(200)
      .end();
  });

  router.get("/:id", authentication, (req, res, next) => {
    res
      .send("WIP")
      .status(200)
      .end();
  });

  router.post("/", authentication, (req, res, next) => {
    res
      .send("WIP")
      .status(200)
      .end();
  });

  router.put("/:id", authentication, (req, res, next) => {
    res
      .send("WIP")
      .status(200)
      .end();
  });

  router.delete("/:id", authentication, (req, res, next) => {
    res
      .send("WIP")
      .status(200)
      .end();
  });
};
