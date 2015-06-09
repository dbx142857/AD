var express = require('express');
var router = express.Router();
var db=require('../models/database.js');
var lib=require('../models/lib.js');
var CONFIG=require('../config/config.js');



router.post('/upload', function(req, res) {

    var file=req.files.myFile,ext=file.extension;
    res.send({
        status:'OK',
        file:file
    })

});
router.post('/save_ad_url',function(req,res){
    var ad_url=req.body.params.ad_url;
    lib.update({
        tableName:'ad',
        set:req.body.params,
        where:{
            ad_id:req.body.params.ad_id
        },
        fields_map:{
            ad_url:'ad_url'
        }
    },req,res);//如果此处有回调函数的话会接受两个参数err,result，也就是重写node-mysql中db.query完成之后的回调方法
})
module.exports = router;
