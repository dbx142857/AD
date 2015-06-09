var express = require('express');
var router = express.Router();
var lib=require('../models/lib.js');
var validate=require('../public/share/validate');
var validate_rule=require('../public/share/ad_plan_modify.validate');


router.get('/get_current_modified_plan',function(req,res){

    console.log('req.params',req.params,req.query)
    lib.query({
        select:'*',
        tableName:'adproject',
        where:{
            adproject_id:req.query.adproject_id
        }
    },req,res);
})
router.post('/',function(req,res){

    validate(validate_rule,req.body.params.formData,function(result){
        if(result.status==='OK'){
            console.log('result is:',result);
            lib.update({
                tableName:'adproject',
                set:result.formData,
                where:{
                    adproject_id:result.formData.adproject_id
                },
                //additionalRules:[
                //    [
                //        function(finalFormData){//参数表示最终的formData
                //            return parseInt(finalFormData.advertisers_id)===parseInt(req.session.user.advertisers_id);
                //        },
                //        '用户的id和当前登录的用户的id不一致，非法入侵'
                //    ]
                //],
                fields_map:{
                    adproject_name:'adproject_name',
                    budget:'budget',
                    budget_day:'budget_day',
                    time_ranges:'time_ranges',
                    startdate:'start_date',
                    stopdate:'stop_date',
                    adproject_id:'adproject_id'
                }
            },req,res);//如果此处有回调函数的话会接受两个参数err,result，也就是重写node-mysql中db.query完成之后的回调方法
        }else{
            res.send({
                status:'ERROR',
                msg:result.err.join('<br>')
            })
        }

    })
})
module.exports = router;