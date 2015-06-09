var mysql=require('mysql');
var config=require('../config/database.js');
var connection=mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pwd,
    database: config.dbname,
    port: 3306
});
connection.connect(function(err) {
    if (err) {
        console.log(err);
    }
});
module.exports=connection;

//var Sequelize = require('sequelize');
//
//var config=require('../config/database.js'),
//    dbname=config.dbname,
//    user=config.user,
//    pwd=config.pwd,
//    host=config.host,
//    port=config.port,
//    dialect=config.dialect;
//module.exports=new Sequelize(dbname,user,pwd,{
//    host:host,
//    port:port,
//    dialect:dialect
//})