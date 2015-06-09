var express = require('express');
var router = express.Router();
var lib=require('../models/lib.js');
var validate=require('../public/share/validate');
var validate_rule=require('../public/share/ad_plan_modify.validate');

router.get('/get_all_available_plan',function(req,res){
    lib.query({
        select:'*',
        tableName:'adproject'
    },req,res);
})
router.get('/get_all_unit_count_for_all_plan',function(req,res){
    lib.query({
        select:'p.adproject_id, c.status, COUNT(c.adcampaign_id)',
        tableName:'adproject p',
        join:'adcampaign c',
        on:'p.adproject_id = c.adproject_id',
        groupBy:'p.adproject_id,c.status'
    },req,res);
})
module.exports = router;
