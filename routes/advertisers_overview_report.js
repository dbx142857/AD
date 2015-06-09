var express = require('express');
var mysql = require('mysql');
var db1 = require('../models/database.js');
var config = require('../config/config.js');
var router = express.Router();
var db2 = null;
var db2connection = require('../models/db2.js');


router.get('/getMapData', function (req, res, next) {
    function query(req) {
        var TEST_TABLE = req.param("userid") + "_advertisers_area_report";

        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];


        // 查询数据
        db2.query(
            'SELECT * FROM (SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,province FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY province  ) AS A ",
            [startDate, endDate],
            function selectData(err, results, fields) {

                var re = [];

                if (err)
                    throw err;


                for (var i = 0; i < results.length; i++) {
                    var data = {
                        //day: results[i].day.toLocaleDateString(),
                        //req: results[i].req,
                        province: results[i].province,
                        imp: results[i].imp
                        //click: results[i].click,
                        //cost: (results[i].money / 1000 / 1000).toFixed(2),
                        //clickrate: parseInt(results[i].click / results[i].imp * 100) + "%"
                    };
                    re.push(data);
                }


                var str = JSON.stringify(re);


                var re = {data: str};

                res.send(re);


            }
        )
        ;

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


router.get('/getChartData', function (req, res, next) {
    function query(req) {

        var TEST_TABLE = req.param("userid") + "_advertisers_project_report";

        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];


        var categories = [];


        var req = [];
        var imp = [];
        var click = [];
        var clickRate = [];
        var cost = [];


        db2.query(
            ' SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,day,project_id,campaign_id  FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <=? GROUP BY day" + '',
            [startDate, endDate], function selectData(err, results, fields) {

                if (results) {

                    for (var i = 0; i < results.length; i++) {

                        categories.push(results[i].day.toLocaleDateString());
                        imp.push(results[i].imp);
                        click.push(results[i].click);
                        clickRate.push(parseInt(results[i].click / results[i].imp * 100));
                        cost.push(parseFloat((results[i].money / 1000 / 1000).toFixed(2)));

                    }
                }

                var re = {
                    categories: categories,
                    series: [
                        {name: "展示量", data: imp},
                        {name: "点击量", data: click},
                        {name: "点击率", data: clickRate},
                        {name: "花费", data: cost}]
                };

                res.send(re);
            }
        )
        ;
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

router.get('/getOverViewTable', function (req, res, next) {

    function query(req) {

        var TEST_TABLE = req.param("userid") + "_advertisers_area_report";
        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];


        // 查询数据
        db2.query(
            'SELECT * FROM (SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <= ?) AS A ",
            [startDate, endDate], function selectData(err, results, fields) {

                var re = [];

                if (err)
                    throw err;


                for (var i = 0; i < results.length; i++) {

                    var clicrate = 0;
                    if (results[i].imp > 0)
                        clicrate = parseInt(results[i].click / results[i].imp * 100) + "%"

                    console.info(parseInt(results[i].click / results[i].imp * 100));
                    var data = {
                            imp: results[i].imp,
                            click: results[i].click,
                            cost: (results[i].money / 1000 / 1000).toFixed(2),
                            clicrate: clicrate

                        }
                        ;
                    re.push(data);
                }


                var str = JSON.stringify(re);
                var re = {data: str};
                res.send(re);


            }
        )
        ;
    }

    if (db2 == null) {

        db2connection(req.session.user.advertisers_id, function (db2_connection) {

            db2 = db2_connection;
            query(req);

        });

    } else {
        query(req);

    }
})
;

module.exports = router;