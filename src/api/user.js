const express = require("express");

const router = express.Router();

const fs = require('fs');
const path = require('path');
const { USER_POOL, cognitoidentityserviceprovider } = require('../lib/cognito')
const s3 = require('../lib/upload');

const DEFAULT_PIC = 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjduaSVu6jnAhXEpOkKHdGBCW4QjRx6BAgBEAQ&url=https%3A%2F%2Fya-webdesign.com%2Fexplore%2Fuser-image-png%2F&psig=AOvVaw2_q_xmciS4aHdKUrzYRAD4&ust=1580375362869936'

router.get("/", async (req, res, next) => {

  try {
    var params = {
      UserPoolId: USER_POOL, /* required */
      // Filter: 'STRING_VALUE',
      // Limit: 'NUMBER_VALUE',
      // PaginationToken: 'STRING_VALUE'
    };
    cognitoidentityserviceprovider.listUsers(params, function (err, data) {
      if (err) return res
        .status(400)
        .send(err)
        .end();
      const responseData = data.Users.map(user => {
        const response = {
          username: user.Username
        }
        user.Attributes.forEach(obj => {
          response[obj.Name.replace('custom:', '')] = obj.Value
        })
        return response;
      }).filter(user => {
        return user.created_by === req.user['cognito:username'] || Boolean(req.query.all)
      })
      res
        .send(responseData)
        .status(200)
        .end();
    });


  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});



router.post("/", async (req, res, next) => {
  try {
    const { username, firstname, surname, email, phone, role = 'user', profile_pic = DEFAULT_PIC, permissions, report_frequency, notification_type } = req.body;

    var params = {
      UserPoolId: USER_POOL,
      Username: username, /* required */
      DesiredDeliveryMediums: [
        'EMAIL',
      ],
      // ForceAliasCreation: true || false,
      // MessageAction: RESEND | SUPPRESS,
      TemporaryPassword: 'password',
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'custom:phone',
          Value: phone
        },
        {
          Name: 'custom:firstname',
          Value: firstname
        },
        {
          Name: 'custom:surname',
          Value: surname
        },
        {
          Name: 'custom:profile_pic',
          Value: profile_pic
        },
        {
          Name: 'custom:permissions',
          Value: permissions
        },
        {
          Name: 'custom:report_frequency',
          Value: report_frequency
        },
        {
          Name: 'custom:notification_type',
          Value: notification_type
        },
        {
          Name: 'custom:role',
          Value: role
        },
        {
          Name: 'custom:created_by',
          Value: req.user["cognito:username"]
        },
      ],
    };
    cognitoidentityserviceprovider.adminCreateUser(params, function (err, data) {
      if (err) return res
        .status(400)
        .send(err)
        .end();

      res.status(200).json({
        message: "Successfully Added User"
      });
    });

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
    const params = {
      UserPoolId: USER_POOL, /* required */
      Filter: "username = \"" + req.params.id + "\"",
      // Limit: 'NUMBER_VALUE',
      // PaginationToken: 'STRING_VALUE'
    };
    cognitoidentityserviceprovider.listUsers(params, function (err, data) {
      if (err) return res
        .status(400)
        .send(err)
        .end();

      const responseData = data.Users.map(user => {
        const response = {
          username: user.Username
        }
        user.Attributes.forEach(obj => {
          response[obj.Name.replace('custom:', '')] = obj.Value
        })
        return response;
      })
      if (responseData.length) {
        res
          .json(responseData[0])
          .status(200)
          .end();
      } else {

        res
          .json({ message: 'User data not found' })
          .status(404)
          .end();
      }
    });

  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  const { firstname, surname, email, phone = "0", role = 'user', profile_pic = DEFAULT_PIC, permissions = "[]", report_frequency = "none", notification_type = "none" } = req.body;

  try {
    var params = {
      UserAttributes: [ /* required */
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'custom:phone',
          Value: phone
        },
        {
          Name: 'custom:firstname',
          Value: firstname
        },
        {
          Name: 'custom:surname',
          Value: surname
        },
        {
          Name: 'custom:profile_pic',
          Value: profile_pic
        },
        {
          Name: 'custom:permissions',
          Value: permissions
        },
        {
          Name: 'custom:report_frequency',
          Value: report_frequency
        },
        {
          Name: 'custom:notification_type',
          Value: notification_type
        },
        {
          Name: 'custom:role',
          Value: role
        },
      ],
      UserPoolId: USER_POOL,
      Username: req.params.id,
    };
    cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function (err, data) {
      if (err) return res
        .status(400)
        .send(err)
        .end();

      res.status(200).json({
        message: "Successfully Updated"
      });
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
    var params = {
      UserPoolId: USER_POOL,
      Username: req.params.id
    };
    cognitoidentityserviceprovider.adminDeleteUser(params, function (err, data) {
      if (err) return res
        .status(400)
        .send(err)
        .end();
      res
        .json({
          data,
        })
        .status(200)
        .end();
    });

  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.post('/upload', async (req, res) => {
  try {

    const params = {
      Bucket: 'customindz-shinobi',
      Key: req.body.id,
      ACL: "public-read",
      Body: req.files.file.data
    };
    s3.upload(params, (s3Err, data) => {
      if (s3Err) {
        console.log(s3Err)
        return res.status(400)
          .send(s3Err.message)
          .end();
      }
      return res
        .json({
          message: 'File uploaded successfully',
          data: data.Location
        })
        .status(200)
        .end();
    });


  } catch (err) {
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
})

module.exports = router;
