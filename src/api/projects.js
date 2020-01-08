const express = require("express");
const shortid = require("shortid");
const router = express.Router();

const { Projects } = require("../lib/db");

router.get('/', async (req, res) => {
  try {

    const query = {
      where: {},
    };
    const data = await Projects.findAndCountAll({
      ...query, where: {
      }
    });

    res.send(data).end();


  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.get('/:id', async (req, res) => {
  try {

    const query = {
      where: {},
    };
    const data = await Projects.findAndCountAll({
      ...query, where: {
      }
    });

    res.send(data).end();


  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await Projects.create({
      id: shortid(),
      ...req.body
    });

    res.send(data).end();


  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    delete req.body.id;
    await Projects.update(req.body, {
      where: { id: req.params.id }
    });
    res
      .send({
        message: "Successfully Updated Project"
      })
      .status(200)
      .end();
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let data = await Projects.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!data) {
      throw new Error("No Project Found");
    }
    res.send(data);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;
