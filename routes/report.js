var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.send('sdfsfsdf')
})
//var db=require('../models/database.js');
//var lib=require('../models/lib.js');
//var CONFIG=require('../config/config.js');
//router.get('/', function(req, res) {
//    require('../models/start.js')(res);
//});
//router.get('/'+CONFIG.AD_URL_CONFIG.GET_ALL_ADPROJECT,function(req,res){
//    var sql=lib.tpl("select * from adproject where adproject_id= '{id}'",{
//        id:req.session.user.advertisers_id
//    });
//    console.log('sqqqqqqqqqq is:',sql);
//    db.query(sql,function(err,result){
//        if(err){
//            res.send({
//                msg:'系统繁忙，请稍后再试'
//            })
//        }
//        else{
//            res.send({
//                adprojects:result
//            })
//        }
//    })
//})
module.exports = router;
