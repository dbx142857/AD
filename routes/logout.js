var express = require('express');
var router = express.Router();
var start=require('../models/start.js');
//var fs= require('fs');
//var CONFIG=require('../config/config.js');
//var db=require('../models/database.js');
//var lib=require('../models/lib.js');
router.get('/', function(req, res) {
    req.session.destroy(function() {
        start(res);
    })
});
module.exports = router;

