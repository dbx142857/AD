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
        var TEST_TABLE = req.session.user.advertisers_id + "_advertisers_project_report";

        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];

        var whereProid = "";
        var whereCamid = "";
        var whereArrSelect = [startDate, endDate];

        if (req.param("proid") != 0) {
            whereProid = " AND A.adproject_id = ? ";
            whereArrSelect.push(req.param("proid"));
        }

        if (req.param("camid") != 0) {
            whereCamid = " AND C.adcampaign_id = ? ";
            whereArrSelect.push(req.param("camid"));
        }

        var categories = [];
        var req = [];
        var imp = [];
        var click = [];
        var clickRate = [];
        var cost = [];

        db2.query(
            "SELECT A.adproject_id,A.adproject_name,B.*,C.adcampaign_id,C.adcampaign_name FROM appserver.adproject AS A ,  (SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,day,project_id,campaign_id  FROM cogtu_offline_analysis." + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY day,project_id,campaign_id ORDER BY day,project_id,campaign_id ASC ) AS B , appserver.adcampaign AS C WHERE A.adproject_id = B.project_id AND C.adcampaign_id = B.campaign_id " + whereProid + "  " + whereCamid + " group by day",
            whereArrSelect, function selectData(err, results, fields) {

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

router.get('/getCampaignTable', function (req, res, next) {
    function query(req) {
        var TEST_TABLE = req.session.user.advertisers_id + "_advertisers_project_report";


        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];


        var whereProid = "";
        var whereCamid = "";
        var whereArrCount = [startDate, endDate];
        var whereArrSelect = [startDate, endDate];

        if (req.param("proid") != 0) {
            whereProid = " AND A.adproject_id = ? ";
            whereArrSelect.push(req.param("proid"));
            whereArrCount.push(req.param("proid"));
        }

        if (req.param("camid") != 0) {
            whereCamid = " AND C.adcampaign_id = ? ";
            whereArrSelect.push(req.param("camid"));
            whereArrCount.push(req.param("camid"));
        }


        whereArrSelect.push(req.param("currentPage") * config.PAGESIZE);
        whereArrSelect.push(config.PAGESIZE);


        //取得表的页数
        var totalPage = 1;
        db2.query("SELECT COUNT(A) AS count FROM (SELECT 1 AS A FROM appserver.adproject AS A ,  (SELECT day,project_id,campaign_id  FROM cogtu_offline_analysis." + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY day,project_id,campaign_id) AS B , appserver.adcampaign AS C WHERE A.adproject_id = B.project_id AND C.adcampaign_id = B.campaign_id " + whereProid + " " + whereCamid + " ) AS FF", whereArrCount, function countRow(err, results, fields) {
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
            "SELECT A.adproject_id,A.adproject_name,B.*,C.adcampaign_id,C.adcampaign_name FROM appserver.adproject AS A ,  (SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,day,project_id,campaign_id  FROM cogtu_offline_analysis." + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY day,project_id,campaign_id ORDER BY day,project_id,campaign_id ASC ) AS B , appserver.adcampaign AS C WHERE A.adproject_id = B.project_id AND C.adcampaign_id = B.campaign_id " + whereProid + " " + whereCamid + " LIMIT ?,?",
            whereArrSelect, function selectData(err, results, fields) {

                var re = [];

                if (err)
                    throw err;


                for (var i = 0; i < results.length; i++) {
                    var data = {
                        day: results[i].day.toLocaleDateString(),
                        adproject_name: results[i].adproject_name,
                        adproject_id: results[i].adproject_id,
                        adcampaign_name: results[i].adcampaign_name,
                        adcampaign_id: results[i].adcampaign_id,
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
            {caption: '广告计划', type: 'string'},
            {caption: '广告活动', type: 'string'},
            {caption: '展示量', type: 'number'},
            {caption: '点击量', type: 'number'},
            {caption: '点击率', type: 'string'},
            {caption: '花费(元)', type: 'number'}
        ];

        var TEST_TABLE = req.session.user.advertisers_id + "_advertisers_project_report";

        var startDate = req.param("date").split(" To ")[0];
        var endDate = req.param("date").split(" To ")[1];


        var whereProid = "";
        var whereCamid = "";
        var whereArrSelect = [startDate, endDate];

        if (req.param("proid") != 0) {
            whereProid = " AND A.adproject_id = ? ";
            whereArrSelect.push(req.param("proid"));
        }

        if (req.param("camid") != 0) {
            whereCamid = " AND C.adcampaign_id = ? ";
            whereArrSelect.push(req.param("camid"));
        }

        conf.rows = [];

        // 查询数据


        db2.query(
            "SELECT A.adproject_id,A.adproject_name,B.*,C.adcampaign_id,C.adcampaign_name FROM appserver.adproject AS A ,  (SELECT SUM(imp) AS imp,SUM(click) AS click,SUM(track) AS track,SUM(money) AS money,day,project_id,campaign_id  FROM cogtu_offline_analysis." + TEST_TABLE + " WHERE day >= ? AND day <= ? GROUP BY day,project_id,campaign_id ORDER BY day,project_id,campaign_id ASC ) AS B , appserver.adcampaign AS C WHERE A.adproject_id = B.project_id AND C.adcampaign_id = B.campaign_id " + whereProid + " " + whereCamid,
            whereArrSelect, function selectData(err, results, fields) {
                var re = [];
                for (var i = 0; i < results.length; i++) {

                    console.info(results[i])

                    conf.rows.push([
                        results[i].day.toLocaleDateString(),
                        results[i].adproject_name,
                        results[i].adcampaign_name,
                        results[i].imp,
                        results[i].click,
                        parseInt(results[i].click / results[i].imp * 100) + "%",
                        (results[i].money / 1000 / 1000).toFixed(2)
                    ]);
                }


                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "advertisers_campaign_report.xlsx");
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

//取得下拉框数据
router.get('/getSelectData', function (req, res, next) {

    var re = [];

    db1.query("SELECT B.adproject_id,B.adproject_name,C.adcampaign_id,C.adcampaign_name FROM appserver.advertisers_user AS A ,appserver.adproject AS B  LEFT JOIN appserver.adcampaign AS C ON C.adproject_id = B.adproject_id WHERE  A.advertisers_id= ? AND A.advertisers_id = B.advertisers_id    ORDER BY B.adproject_name,C.adcampaign_name DESC", [req.session.user.advertisers_id], function selectData(err, results, fields) {

            if (results) {

                var tmp = {
                    adproject_id: -1,
                    adproject_name: "",
                    campaign: []
                };

                for (var i = 0; i < results.length; i++) {

                    if (tmp.adproject_id == -1) {
                        tmp.adproject_id = results[i].adproject_id;
                        tmp.adproject_name = results[i].adproject_name;
                    }

                    if (tmp.adproject_id != results[i].adproject_id) {
                        re.push(tmp);

                        tmp = {
                            adproject_id: results[i].adproject_id,
                            adproject_name: results[i].adproject_name,
                            campaign: []
                        };
                    }


                    if (results[i].adcampaign_id != null) {

                        var cam = {
                            adcampaign_id: results[i].adcampaign_id,
                            adcampaign_name: results[i].adcampaign_name
                        };

                        tmp.campaign.push(cam);
                    }
                }
                re.push(tmp);
            }

            res.send(re);
        }
    )
    ;
})
;

module.exports = router;