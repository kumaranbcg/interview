const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const Configuration = require("../models/configuration");
const axios = require("axios");

router.get("/", async (req, res) => {
  // Get All For User
  try {
    const data = await Configuration.findOne({
      where: {
        monitor_id: req.query.monitor_id,
        engine: req.query.engine
      }
    });
    res
      .send(data)
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

router.get("/:id", async (req, res, next) => {
  try {
    let data = await Configuration.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!data) {
      throw new Error("No Configuration Found");
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
  console.log("Creating Configuration");
  try {

    const existingConfig = await Configuration.findOne({
      where: {
        monitor_id: req.body.monitor_id,
        engine: req.body.engine
      }
    });

    if (existingConfig) {
      await Configuration.update({
        config:req.body.config
      }, {
        where: { id: existingConfig.id }
      });
      res.status(200).json({
        message: "Successfully Updated Configuration"
      });
    }
    else {
      const CONFIGURATION_ID = shortid.generate();
      const newConfiguration = {
        id: CONFIGURATION_ID,
        monitor_id: req.body.monitor_id,
        engine: req.body.engine,
        config: req.body.config
      };

      await Configuration.create(newConfiguration);

      res.status(200).json({
        id: newConfiguration.id,
        message: "Successfully Added Configuration"
      });
    }

    
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
    await Configuration.update(req.body, {
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
    await Configuration.destroy({
      where: {
        id: req.params.id
      }
    });

    res
      .json({
        message: "Successfully Deleted Configuration"
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
