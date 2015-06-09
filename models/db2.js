/**
 * Created by BTW on 2015/5/29.
 */
var db1 = require('./database.js');
var mysql = require('mysql');
var config = require('../config/config.js');
var db2_pro = function (advid, cb) {

    db1.query(
        "SELECT * FROM cogtu_offline_analysis.user_db_location WHERE userid = " + advid,
        function selectData(err, results, fields) {

            if (results) {

                for (var i = 0; i < results.length; i++) {

                    var connection = mysql.createConnection({
                        host: results[i].ip,
                        user: results[i].username,
                        password: results[i].password,
                        database: results[i].dbname,
                        port: results[i].port
                    });
                    connection.connect(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    cb(connection);
                }
            }
        });
}

module.exports = db2_pro;
