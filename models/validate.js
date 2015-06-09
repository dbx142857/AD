function validate(tableName,formData){

    var err=[];
    var is_null=function(val){
        //console.log("hhhhhhhhh",val)
        return (typeof(val)==='undefined')||(typeof(val)==='string'&&val.trim()==='');
    }
    //var msg='';
    function check(checkRules){
        console.log('formData is:',formData);
        for(var i in checkRules){
            var item=checkRules[i];
            var val=formData[i];



            if(typeof(item)==='string'){
                console.log('----------',val,is_null(val));
                if(is_null(val)){
                    err.push(item+'不能为空');
                }
            }else if(typeof(item)==='object'){
                if(!item.rule.test(val)){
                    err.push(item.msg);
                }
            }



        }
    }





    switch(tableName){
        case 'adproject':
            check({
                advertisers_id:'用户id',
                adproject_name:{
                    rule:/^[a-zA-Z0-9.\-_$@*!]{5,15}$/,
                    name:'广告计划名称',
                    msg:'广告计划名称格式错误(长度应在6-16,不包含特殊字符)'
                },
                budget:'总预算',
                budget_day:'每日预算',
                time_ranges:'投放时间',
                start_date:'投放日期',
                stop_date:'投放日期'
            });
            break;
    }

    var msg=err.join('<br>');
    console.log('---------msg is:',msg);
    //return {
    //    msg:msg
    //}

    if(msg===''){
        return true;
    }else{
        return {
            msg:msg
        }
    }if(msg===''){
        return true;
    }else{
        return {
            msg:msg
        }
    }

}
module.exports=validate;