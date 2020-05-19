'use strict';
var MEANLib = require("@ttcorestudio/mexn-server");
var middlewareRouter = MEANLib.modules.express.Router();
var router = MEANLib.modules.express.Router();
module.exports = middlewareRouter;

var Status = require("server/db/models/Status/_Status");

const triggerUpdates = require('server/lib/trigger_updates');


middlewareRouter.use("/", function (req, res, next) {
  return next();
}, router);

/**
body = {
    status:0,
}
*/
router.post("/report", function (req, res) {

  var status = new Status({
    status: req.body.status,
    user: req.user
  });

  status.save(async function (err, savedStatus) {

    const triggerData = {
      user: req.user,
      statusEnum: status.status
    };
    
    // no await
    triggerUpdates(triggerData);
    
    if (!err) return res.json(savedStatus);
    else return res.status(500).send(err);
  });

});

router.get("/get-current", function (req, res) {
  Status.find({
      "user": req.user._id
    }).sort({
      date: -1
    }).limit(1)
    .exec(function (err, statuses) {
      if (statuses == null) res.json(null);
      if (!err) return res.json(statuses[0]);
      else return res.status(500).send(err);
    });

});
