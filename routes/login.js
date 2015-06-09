var express = require('express');
var router = express.Router();
var db=require('../models/database.js');
var crypto = require('crypto');
var lib=require('../models/lib.js');

//router.get('/', function(req, res) {
//    require('../models/start.js')(res);
//});
router.post('/',function(req,res){

    var params=req.body.params;
    //口令散列值
    var md5 = crypto.createHash('md5');
    var pwd= md5.update(params.advertisers_password).digest('base64');
    var sql=lib.tpl("select * from advertisers_user where advertisers_name = '{user}' and advertisers_password = '{pwd}'",{
        user:params.advertisers_name,
        pwd:pwd
    });
    console.log('sql is:',sql);
    db.query(sql,function(err,result){
        console.log('err,result:',err,result);
        if(err){
            res.send({
                msg:'系统繁忙，请稍后再试'
            })
        }else{
            if(result.length===0){
                res.send({
                    msg:'用户名或密码错误，请重新登录'
                })
            }
            else{

                var ses=result[0];

                if(ses.status==='N'){
                    res.send({

                        msg:'您已经被停权，如有疑问，请联系管理员'
                    })
                }else{
                    delete ses.advertisers_password;
                    req.session.user=ses;
                    console.log('ses is',ses);
                    //req.session.username=params.advertisers_name;
                    res.send(ses);
                }

            }
        }
    })




    //db.query('select * from advertisers_user where advertisers_name = ? and advertisers_password = ?',
    //    null,
    //    {logging : true, plain : true,  raw : true},
    //    [params.advertisers_name,pwd]
    //)
    //    .success(function(e){
    //        console.log(e);
    //        if(!e){
    //            res.send({
    //                msg:'用户名或密码错误，请重新登录'
    //            })
    //        }
    //        else{
    //            res.send({
    //                advertisers_name: e.advertisers_name
    //            })
    //        }
    //        res.send(e);
    //    });
})
module.exports=router;