const express = require("express");
const shortid = require("shortid");
const router = express.Router();

const { PathDetection } = require("../lib/db");
router.get("/", async (req, res) => {
  try {
    console.log(req['user']);

    const data = await PathDetection.findAll({
      where: {
        user_id: req.user["cognito:username"]
      }
    });
    res
      .send(data)
      .status(200)
      .end();
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let data = await Monitor.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!data) {
      throw new Error("No Path Detection Object Found");
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

router.post("/", async (req, res, next) => {
  console.log("Creating Object for Path Detection");
  try {
    const PATHDETECTION_ID = req.body.id || shortid.generate();
    const newPath = {
      id: PATHDETECTION_ID,
      user_id: 'fvkjnfdjn',
      name: req.body.name || "Default Path Name",
      source_uri: req.body.url,
      zone: req.body.zone
    };

    await PathDetection.create(newPath);

    res.status(200).json({
      id: newPath.id,
      message: "Successfully Added Path"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    delete req.body.id;
    await PathDetection.update(req.body, {
      where: { id: req.params.id }
    });
    res
      .send({
        message: "Successfully Update"
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
    await PathDetection.destroy({
      where: {
        id: req.params.id
      }
    });

    res
      .json({
        message: "Successfully Deleted Path for detected Object"
      })
      .status(200)
      .end();
  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});


module.exports = router;
