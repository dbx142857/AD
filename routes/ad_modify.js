var express = require('express');
var router = express.Router();
var lib=require('../models/lib.js');
var validate=require('../public/share/validate');
var validate_rule=require('../public/share/ad_plan_modify.validate');

router.get('/query_current_modified_ad',function(req,res){
    lib.query({
        select:'*',
        tableName:'ad',
        where:{
            ad_id:req.query.ad_id
        }
    },req,res);
})
module.exports = router;