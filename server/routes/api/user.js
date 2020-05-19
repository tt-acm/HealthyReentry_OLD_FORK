const router = require('express').Router();

const User = require('../../models/User');

const fs = require('fs');
const sgClient = require("server/lib/sgClient");



router.post("/user-by-email", function(req, res) {

  let include = { // returns only email, profile name, and _id
    "_id": 1,
    "sso.email": 1,
    "sso.profile.name": 1
  }

  User.findOne({
    "sso.email": req.body.email
  }, include)
      .exec(function(err, user) {
          if (err) {
              //console.log(err);
              return res.status(500).send();
          }
          return res.json(user);
      });
});


router.get("/consent-signed", function (req, res) {
  // console.log("getting here", req.user.id);
  User.findById(req.user.id)
    .exec(function (err, user) {
      if (!err) {
        // console.log("user", user);
        user.dateOfConsent = new Date();

        user.save(function (error, updatedUser) {
          if (error) return res.status(500).send();
          // send copy of consent


          sendEmail(req.user.sso.email, req.user.sso.profile.name).then(function () {
            // return res.send(updatedUser);
            // console.log("copy of consent sent");
          });
          return res.send(updatedUser);

        });


      } else {
        return res.status(500).send();
      }
    });


  function sendEmail(userEmail, userName) {
    return new Promise(function (resolve, reject) {

      var title = "Encounter App - Disclosure & Consent";
      var firstName = userName.split(' ')[0];
      var thisHTML = "<div><p>"+ firstName+ ",<br><br>Thank you for enrolling in the Encounter application. Attached is the disclosure and consent file you reviewed and agreed to.</p></div>";

      const path = 'server/lib/assets/Disclosure.pdf';
      var attachment = fs.readFileSync(path);


      let buff = new Buffer(attachment);
      let base64data = buff.toString('base64');
      console.log("about to");

      // attachment str(b64data,'utf-8')
      const mailOptions = {
        to: userEmail,
        from: process.env.SENDGRID_EMAIL,
        subject: title,
        text: " ",
        html: thisHTML,
        "attachments": [{
          "content": base64data,
          "content_id": "disclosure",
          "disposition": "attachment",
          "filename": "Disclosure and Consent.pdf",
          "type": "application/pdf"
        }]

      };
      // console.log("mailOptions", mailOptions);

      // https://github.com/sendgrid/sendgrid-python/blob/master/USAGE.md#post-mailsend
      sgClient.sendMultiple(mailOptions, function (err) {
        if (err) {
          console.log("email failed", err);
          reject();
        }

        console.log("sent");
        resolve();
      });

    });

  }

});


//get all users
router.get("/get-all", function (req, res) {

  let include = { // returns only email, profile name, and _id
    "_id": 1,
    "sso.email": 1,
    "sso.profile.name": 1
  }


  User.find({
      _id: {
        $ne: req.user.id
      }
    }, include)
    .exec(function (error, minUsers) {
      if (!error) return res.json(minUsers);
      else return res.status("500").send("Unable to perform find");
    })

});



module.exports = router;
