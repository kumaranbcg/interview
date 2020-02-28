const express = require("express");
const router = express.Router();
const { Company } = require("../lib/db");

//get all companies
router.get("/", async (req, res) => {
  try {
    let query = {
      offset: 0,
      where: {}
    };
    const data = await Company.findAll(query);
    res
      .send(data)
      .status(200)
      .end();
  } catch (err) {
    console.log(err);
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    var data = await Company.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(data);
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

//create company
//{name, company_code, created_at, updated_at,sms_frequency, email_frequency}
router.post("/", async (req, res, next) => {
  try {
    // Create Company In Our Database
    await Company.create({
      ...req.body
    });

    console.log(res);

    res.status(200).json({
      message: "Successfully Added Company"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await Company.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({
      message: "Successfully Updated"
    });
  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Company.destroy({
      where: {
        id: req.params.id
      }
    });
    res
      .json({
        message: "Successfully Deleted Company"
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
