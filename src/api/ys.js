module.exports = router => {
  router.get("/access-token", (req, res, next) => {
    res
      .send({
        token:"at.4gwook1i1qz9odlfd6peg4ff0s00g1vs-8ky2uaaae7-1ar9w11-zckeikdfj"
      })
      .status(200)
      .end();
  });
};
