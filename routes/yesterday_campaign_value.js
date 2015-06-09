var express = require('express');
var mysql = require('mysql');
var db1 = require('../models/database.js');
var db = require('../models/database.js');
var config = require('../config/config.js');
var router = express.Router();
var db2 = null;
var db2connection = require('../models/db2.js');


router.get('/totalConsumption', function (req, res) {

    db.query('SELECT advertisers_id,project_id,campaign_id,SUM(money)+SUM(coupon) FROM cogtu_offline_analysis.admin_all_advertisers_cost_report WHERE advertisers_id = ?  GROUP BY advertisers_id,project_id,campaign_id', [req.session.user.advertisers_id],
        function (err, result) {
            if (err) {
                console.log('err is:', err);
            }
            res.send(result);
        }
    )
})

router.get('/getCampaign', function (req, res, next) {


    function qurey(req) {


        var TEST_TABLE = req.session.user.advertisers_id + "_advertisers_project_report";


        db2.query("SELECT campaign_id,SUM(imp) AS imp,SUM(click) AS click FROM cogtu_offline_analysis." + TEST_TABLE + " WHERE TO_DAYS(NOW( )) - TO_DAYS(day) <= 2 AND project_id =?  GROUP BY campaign_id", [req.param("project_id")], function (err, results, fields) {

            if (err) {
                console.log('err is:', err);
            }
            var re = [];
            //console.log('results is:',results);
            if (results) {

                for (var i = 0; i < results.length; i++) {
                    var data = {
                        campaign_id: results[i].campaign_id,
                        imp: results[i].imp,
                        click: results[i].click,
                        clickrate: parseInt(results[i].click / results[i].imp * 100) + "%"
                    };

                    re.push(data);
                }

                console.log('re is', re);
                res.send(re);
            }
            //res.send('helloooooooooo')


        })


    }

    if (db2 == null) {

        db2connection(req.session.user.advertisers_id, function (db2_connection) {

            db2 = db2_connection;
            query(req);

        });

    } else {
        query(req);

    }

});

router.get('/getProject', function (req, res, next) {

        function query(req) {


            var TEST_TABLE = req.session.user.advertisers_id + "_advertisers_project_report";

            db2.query("SELECT project_id,SUM(imp) AS imp,SUM(click) AS click FROM cogtu_offline_analysis." + TEST_TABLE + " WHERE TO_DAYS(NOW( )) - TO_DAYS(day) <= 2   GROUP BY project_id", function (err, results, fields) {

                var re = [];
                if (results) {
                    for (var i = 0; i < results.length; i++) {
                        var data = {
                            project_id: results[i].project_id,

                            imp: results[i].imp,
                            click: results[i].click,
                            clickrate: parseInt(results[i].click / results[i].imp * 100) + "%"
                        };

                        re.push(data);
                    }

                    res.send(re);
                }


            })


        }

        if (db2 == null) {

            db2connection(req.session.user.advertisers_id, function (db2_connection) {

                db2 = db2_connection;
                query(req);

            });

        } else {
            query(req);

        }

    }
)
;


module.exports = router;