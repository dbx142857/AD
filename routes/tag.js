var express = require('express');
var router = express.Router();
var lib=require('../models/lib.js');
//var validate=require('../public/share/validate');
//var validate_rule=require('../public/share/ad_plan_modify.validate');


router.get('/get_all_tags',function(req,res){

    console.log('req.params',req.params,req.query)
    lib.query({
        select:'tag_tree',
        tableName:'tag_config'
    },req,res);
})

module.exports = router;