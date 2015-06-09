var express = require('express');
var router = express.Router();
var lib=require('../models/lib.js');

router.get('/get_current_modified_campaign',function(req,res){
    lib.query({
        select:'*',
        tableName:'adcampaign',
        where:{
            adcampaign_id:req.query.adcampaign_id
        }
        //"adcampaign_id='"+adcampaign_id+"'"
    },req,res);
})
module.exports = router;