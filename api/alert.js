module.exports = router => {
  router.post("/alert", (req, res, next) => {
    res
      .send("WIP")
      .status(200)
      .end();
  });
};
