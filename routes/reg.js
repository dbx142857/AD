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
    var keys={'advertisers_name':'用户名','advertisers_email':'邮箱','advertisers_password':'密码'};
    for(var i in keys){
        if(typeof(params[i])==='undefined'){
            res.send({
                msg:keys[i]+'不存在或者格式错误'
            })
            return false;
        }
    }
    if(params['advertisers_password']!==params['re_advertisers_password']){
        res.send({
            msg:'两次密码输入不一致'
        });
        return false;
    }
    var sql=lib.tpl("select * from advertisers_user where advertisers_name = '{user}'",{
        user:params.advertisers_name
    });
    db.query(sql,function(err,result){
        if(err){
            res.send({
                msg:'系统繁忙，请稍后再试'
            })
        }else{
            if(result.length!==0){
                res.send({
                    msg:'亲，该账户已经存在了哦'
                })
            }
            else{
                var sql=lib.tpl("select * from advertisers_user where advertisers_email = '{email}'",{
                    email:params.advertisers_email
                });
                db.query(sql,function(err,result){
                    if(err){
                        res.send({
                            msg:'系统繁忙，请稍后再试'
                        })
                    }else{
                        if(result.length!==0){
                            res.send({
                                msg:'亲，该邮箱已经存在了哦'
                            })
                        }else{
                            var md5 = crypto.createHash('md5');
                            var pwd= md5.update(params.advertisers_password).digest('base64');
                            var sql=lib.tpl("INSERT INTO advertisers_user (advertisers_id,advertisers_name,advertisers_password,advertisers_email) VALUES (null,'{name}','{pwd}','{email}')",{
                                name:params.advertisers_name,
                                pwd:pwd,
                                email:params.advertisers_email
                            })
                            //var ses={
                            //
                            //}
                            console.log('reg sql is:',sql);
                            console.log('pwd is:',pwd);
                            db.query(sql,function(err,result){
                                console.log('sql is:',sql);
                                if(err){
                                    console.log('err is:',err)
                                    res.send({
                                        msg:'系统繁忙，请稍后再试'
                                    })
                                }else{
                                    if(typeof(result.affectedRows)!=='undefined'){
                                        var sql=lib.tpl("select * from advertisers_user where advertisers_name = '{user}'",{
                                            user:params.advertisers_name
                                        });
                                        db.query(sql,function(err,result){
                                            var ses=result[0];

                                            delete ses.advertisers_password;
                                            req.session.user=ses;
                                            //console.log('ses is',ses);
                                            //req.session.username=params.advertisers_name;
                                            res.send(ses);
                                        })
                                        //res.send({
                                        //    advertisers_name: params.advertisers_name
                                        //})
                                    }
                                    else{
                                        res.send({
                                            msg:'系统繁忙，请稍后再试'
                                        })
                                    }
                                }
                            })

                        }
                    }
                })
            }
        }
    })






})
module.exports=router;