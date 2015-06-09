var express = require('express');
var router = express.Router();
//var db=require('../models/database.js');
var lib=require('../models/lib.js');

router.get('/get_location',function(req,res){
    lib.query({
        select:'*',
        tableName:'location'
    },req,res);
})
module.exports = router;
