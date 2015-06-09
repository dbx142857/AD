var express = require('express');
var router = express.Router();

var lib=require('../models/lib.js');
//var validate=require('../public/share/validate');
//var validate_rule=require('../public/share/ad_plan_modify.validate');

router.get('/get_all_avaliable_ads',function(req,res){
    lib.query({
        select:'*',
        tableName:'adproject'
    },req,res);
})
router.get('/get_unit_count',function(req,res){
    console.log('req query is:',req.query)
    lib.query({
        tableName:'adcampaign',
        select:'*, adcampaign.status as adcampaign_status,ad.check_status as check_status',
        join:'ad',
        on:"ad.ad_id=adcampaign.ad_id",
        where:{
            "adcampaign.adproject_id":req.query.adproject_id
        }
        //where:"adcampaign.adproject_id="+project_id+""
    },req,res);
})
module.exports = router;
