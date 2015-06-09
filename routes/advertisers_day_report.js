var express = require('express');
var mysql = require('mysql');
var db1 = require('../models/database.js');
var config = require('../config/config.js');
var router = express.Router();
var db2 = null;
var db2connection = require('../models/db2.js');
var nodeExcel = require('excel-export');

router.get('/getChartData', function (req, res, next) {

    function query(req) {
        var TEST_TABLE = req.param("userid") + "_advertisers_area_report";
        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];


        var categories = [];


        var req = [];
        var imp = [];
        var click = [];
        var clickRate = [];
        var cost = [];


        db2.query('SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,day FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY day   "
            , [startDate, endDate],
            function selectData(err, results, fields) {

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

router.get('/getDayTable', function (req, res, next) {
    function query(req) {
        var TEST_TABLE = req.param("userid") + "_advertisers_area_report";

        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];


        //取得表的页数
        var totalPage = 1;
        db2.query('SELECT COUNT(A) AS count FROM (SELECT 1 AS A FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY day ORDER BY day ASC ) AS A ", [startDate, endDate], function countRow(err, results, fields) {
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


        });

        // 查询数据
        db2.query(
            'SELECT * FROM (SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,day FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY day ORDER BY day ASC ) AS A LIMIT ?,?",
            [startDate, endDate, req.param("currentPage") * config.PAGESIZE, config.PAGESIZE], function selectData(err, results, fields) {

                var re = [];

                if (err)
                    throw err;


                for (var i = 0; i < results.length; i++) {
                    var data = {
                        day: results[i].day.toLocaleDateString(),
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

router.get('/Excel', function (req, res, next) {


    function query() {
        var conf = {};
        // uncomment it for style example
        // conf.stylesXmlFile = "styles.xml";
        conf.cols = [
            {caption: '日期', type: 'string'},
            {caption: '展示量', type: 'number'},
            {caption: '点击量', type: 'number'},
            {caption: '点击率', type: 'string'},
            {caption: '花费(元)', type: 'number'}
        ];

        var TEST_TABLE = req.session.user.advertisers_id + "_advertisers_project_report";

        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];

        conf.rows = [];

        // 查询数据

        // 查询数据
        db2.query(
            'SELECT * FROM (SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,day FROM cogtu_offline_analysis.' + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY day ORDER BY day ASC ) AS A ",
            [startDate, endDate], function selectData(err, results, fields) {
                var re = [];
                for (var i = 0; i < results.length; i++) {

                    console.info(results[i])

                    conf.rows.push([
                        results[i].day.toLocaleDateString(),
                        results[i].imp,
                        results[i].click,
                        parseInt(results[i].click / results[i].imp * 100) + "%",
                        (results[i].money / 1000 / 1000).toFixed(2)
                    ]);
                }


                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "advertisers_day_report.xlsx");
                res.end(result, 'binary');
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

module.exports = router;