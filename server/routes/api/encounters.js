const router = require('express').Router();

const sgClient = require("../../lib/sgClient");
const variables = require("../../util/variables");
const eg = require('../../lib/build_encounter_graph');

const User = require('../../models/User');
const Encounter = require('../../models/Encounter');



/**
 * @api {post} /api/encounters/add-one
 * @apiName Encounters
 * @apiDescription adding an encounter to database
 * @apiGroup encounters
 *
 * @apiSuccess {Object} true;
 * @apiError 500 Internal Server Error
 *
 * @apiParam {date} date - date of the encounter if null use today's date
 * @apiParam {string} id - encountered user's id ( use id or email)
 * @apiParam {string} email- encuntered user's email ( use id or email)
 */
router.post("/add-one", function (req, res) {

    var encounter = new Encounter({
        users: []
    });
    if (req.body.date) encounter.date = req.body.date;
    else encounter.date = new Date();

    if (req.body.id) {
        encounter.users.push(req.body.id); // req.user will be added presave
        encounter.save(function (err, savedEncounter) {
            if (!err) return res.json(savedEncounter);
            else return res.status("500").send(err);
        });

    } else if (req.body.email) {

        User.findOne({
                "email": req.body.email.toLowerCase()
            })
            .exec(function (err, user) {
                if (!err) {
                    encounter.users.push(user); // req.user will be added presave
                    encounter.save(function (error, savedEncounter) {
                        if (!error) return res.json(savedEncounter);
                        else return res.status("500").send(error);
                    });

                } else {
                    return res.status(500).send(err);
                }
            });

    }
});


/**
 * @api {post} /api/encounters/add-many
 * @apiName Encounters
 * @apiDescription adding many encounters to database, can be group encounters
 * @apiGroup encounters
 *
 * @apiSuccess {Object} true;
 * @apiError 500 Internal Server Error
 *
 * @apiParam {date} date - date of the encounter if null use today's date
 * @apiParam {String[]} ids - user ids ( not include the sender)
 * @apiParam {boolean} isGroup - if true it is group encounters (combinations), if false only with the sender
 */
router.post("/add-many", function (req, res) {

    return new Promise(function (resolve, reject) {
        let ids = req.body.encounters.reduce(function (out, x) {
            out.push(x._id);
            return out;
        }, []);
        var numEncounters = ids.length;
        if (req.body.isGroup === "true") numEncounters = combinations(numEncounters + 1, 2);

        var encounters = [];

        if (req.body.isGroup === "true") {
            // add sender to ids and add all combinations to encounter array
            req.body.ids.push(req.user.id);

            for (var k = 0; k < req.body.ids.length - 1; k++) {

                var id = req.body.ids[k];

                for (var l = k + 1; l < req.body.ids.length; l++) {
                    var e = new Encounter({
                        users: []
                    });
                    if (req.body.date) e.date = req.body.date;

                    else e.date = new Date();
                    e.users.push(id);
                    e.users.push(req.body.ids[l]);
                    encounters.push(e.toObject());

                    isDone();

                }
            }

        } else {

            // this add enounters with the sender user only
            ids.forEach(function (id) {

                var e = new Encounter({
                    users: []
                });
                if (req.body.date) e.date = req.body.date;
                else e.date = new Date();
                e.users.push(req.user.id);
                e.users.push(id);
                encounters.push(e.toObject());

                isDone();

            });

        }

        //https://www.w3resource.com/javascript-exercises/javascript-math-exercise-42.php
        //calculation of the k combination
        function product_Range(a, b) {
            var prd = a,
                i = a;

            while (i++ < b) {
                prd *= i;
            }
            return prd;
        }


        function combinations(n, r) {
            if (n == r) {
                return 1;
            } else {
                r = (r < n - r) ? n - r : r;
                return product_Range(r + 1, n) / product_Range(1, n - r);
            }
        }

        function isDone() {

            if (encounters.length === numEncounters) {
                Encounter.insertMany(encounters, function (err, docs) {
                    console.log(docs);
                    if (err) {
                        console.log("error in insert Many", err);
                        resolve(res.status(500).send());

                    } else {
                        resolve(res.json(true));
                    }
                });
            }
        }

    });



});


/**
 * @api {get} /api/encounters/find-frequent-encounters
 * @apiName Encounters
 * @apiDescription finds frequent encounters
 * @apiGroup encounters
 *
 * @apiSuccess {Object[]} encounters { -id, email, name, encounteredToday};
 * @apiError 500 Internal Server Error
 *
 */
router.get("/find-frequent-encounters", function (req, res) {
    //https://docs.mongodb.com/manual/tutorial/query-arrays/

    var checkDate = new Date();
    var pastDate = checkDate.getDate() - 7;
    checkDate.setDate(pastDate);
    const today = new Date().toJSON().slice(0,10).replace(/-/g,'/');

    // returns only email, profile name, and _id
    let include = {
        "_id": 1,
        "email": 1,
        "name": 1
    }

    Encounter.find({
            "users": req.user._id,
            "date": {
                "$gte": checkDate
            }
        }).populate("users", include).sort({
            "date": -1
        })
        .exec(function (err, encounters) {
            var frequentEncounters = [];
            encounters.forEach(function (e) {

                e.users.forEach(function (user) {
                    var index = frequentEncounters.findIndex(obj => obj._id == user._id);
                    if (index === -1 && user.id != req.user.id) {
                        var jsonString = JSON.stringify(user);
                        var userObj = JSON.parse(jsonString);

                        const eDate = new Date(e.date).toJSON().slice(0,10).replace(/-/g,'/');

                        if (eDate === today) {
                            userObj.encounteredToday = true;
                        } else userObj.encounteredToday = false;
                        frequentEncounters.push(userObj);
                    }
                })
            });

            res.json(frequentEncounters);
        });
});



/**
 * @api {get} /api/encounters/get graph
 * @apiName Encounters
 * @apiDescription get graphs of all encounters and send email to admin and notify downstream contacts
 * @apiGroup encounters
 *
 * @apiSuccess {Boolean} true
 * @apiError 500 Internal Server Error
 *
 */
router.post("/get-graph", function (req, res) {

    eg(req.user.email).then(function (graph) {

        var headers = "Email, Number Of Direct Encounters, Degree of Separation , Status";

        var csv = graph.map(function (d) {
                return JSON.stringify(Object.values(d));
            })
            .join('\n')
            .replace(/(^\[)|(\]$)/mg, '');


        csv = headers + '\n' + csv;
        let buff = new Buffer(csv);
        let base64data = buff.toString('base64');

        ///EMAIL SERVICE
        // Admin List to Change
        var title = "Encounter Alert - ALPHA TESTING";
        var thisHTML = "<div><p><strong>Attention:</strong><br><br>" + req.user.name + " reported their COVID_19 status as <i>" + req.body.status + ".</i><br><br>Attached are all of the employee’s encounters that have occurred within the last 14 days.</p></div>";

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var newdate = month + "/" + day + "/"+ year;
        var fileName = req.user.name + "-" + req.body.status + "-"+ newdate + ".csv";
        const mailOptions = {
            to: variables.ADMIN_USERS,
            from: process.env.SENDGRID_EMAIL,
            subject: title,
            text: " ",
            html: thisHTML,
            "attachments": [{
                "content": base64data,
                "content_id": "",
                "disposition": "attachment",
                "filename": fileName,
                "type": "text/csv"
            }]

        };

        sendEmail(mailOptions).then(function () {
            return res.json(graph);
        });

    });


    function sendEmail(mailOptions) {
        return new Promise(function (resolve, reject) {
            // https://github.com/sendgrid/sendgrid-python/blob/master/USAGE.md#post-mailsend
            sgClient.send(mailOptions, function (err) {
                if (err) {
                    console.log("email failed", err);
                    reject();
                }

                resolve();
            });

        });

    }


});



module.exports = router;
