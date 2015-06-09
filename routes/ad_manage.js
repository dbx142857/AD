var express = require('express');
var router = express.Router();
var lib=require('../models/lib.js');
//var validate=require('../public/share/validate');
//var validate_rule=require('../public/share/ad_plan_modify.validate');

router.get('/get_all_avaliable_ads',function(req,res){
    lib.query({
        select:'*',
        tableName:'ad'
    },req,res);
})
module.exports = router;
