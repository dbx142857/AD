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
            [startDate, endDate], function selectData(err, results, fields) {

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


            });
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

router.get('/getAreaTable', function (req, res, next) {


    if (db2 == null) {

        db2connection(req.session.user.advertisers_id, function (db2_connection) {
            db2 = db2_connection;
            query(req);

        });

    } else {
        query(req);
    }

    function query() {


        var TEST_TABLE = req.param("userid") + "_advertisers_area_report";


        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];


        //取得表的页数
        var totalPage = 1;
        db2.query('SELECT COUNT(A) AS count FROM (SELECT 1 AS A FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY province ) AS A", [startDate, endDate], function countRow(err, results, fields) {
            if (results) {
                for (var i = 0; i < results.length; i++) {

                    if (results[i].count == 0)
                        totalPage = 1;
                    else if (parseInt(results[i].count) % config.PAGESIZE == 0) {
                        totalPage = parseInt(results[i].count / config.PAGESIZE);
                    } else {
                        totalPage = parseInt(results[i].count / config.PAGESIZE) + 1;
                    }
                }
            }
        })


        // 查询数据
        db2.query(
            'SELECT * FROM (SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,province FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY province ORDER BY province ASC ) AS A LIMIT ?,?",
            [startDate, endDate, req.param("currentPage") * config.PAGESIZE, config.PAGESIZE], function selectData(err, results, fields) {

                var re = [];

                if (err)
                    throw err;


                for (var i = 0; i < results.length; i++) {
                    var data = {
                        province: results[i].province,
                        imp: results[i].imp,
                        click: results[i].click,
                        cost: (results[i].money / 1000 / 1000).toFixed(2),
                        clickrate: parseInt(results[i].click / results[i].imp * 100) + "%"
                    };
                    re.push(data);
                }


                var str = JSON.stringify(re);


                var re = {data: str, totalPage: parseInt(totalPage), currentPage: parseInt(req.param("currentPage"))};

                res.send(re);


            });

    }

});


module.exports = router;