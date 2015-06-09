(function(){
    var obj={
        adproject_name:{
            type:'string',
            rules:[
                [
                    function(val){
                        var getByteLen = function (val) {
                            var len = 0;
                            for (var i = 0; i < val.length; i++) {
                                if (val[i].match(/[^x00-xff]/ig) != null) //全角
                                    len += 2;
                                else
                                    len += 1;
                            };
                            return len;
                        }

                        var len=getByteLen(val);
                        return (len>=4)&&(len<=20);
                    },
                    '广告计划名称格式错误,长度不合法(4-20位字符)'
                ],
                [
                    function(val){
                        return new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$").test(val);
                    },
                    '广告计划名称格式错误，请不要包含特殊字符'
                ]
            ],
            name:'广告计划名称'
        },
        budget:{
            name:'总预算',
            type:'int',
            rules:[
                [
                    function(val){
                        //console.log('val is:',val,this.budget_day);
                        return val>=this.budget_day
                    },
                    '总预算必须不小于每日预算'
                ]
            ]
        },
        budget_day:{
            name:'每日预算',
            type:'int'
        },
        time_ranges:{
            name:'投放时间',
            type:'string',
            rules:[
                [
                    function(val){

                        var result=true;
                        var val=val.trim().split(' ');
                        for(var i in val){
                            if(['1','2','3','4','5','6','7'].indexOf(val[i])===-1){
                                result=false;
                                break;
                            }
                        }
                        return result;
                    },
                    '投放时间字段不合法'
                ]
            ]
        },
        startdate:{
            name:'投放开始日期',
            type:'date',
            format:'y-m-d',
            setVal:{
                reference:'range',
                set:function(refer_val){
                    return refer_val.split(' To ')[0].trim().substring(0,10);
                }
            },
            rules:[
                [
                    function(val){
                        //console.log('val and stop_date',val,this.stop_date);
                        //console.log('开始日期',new Date(val).getTime())
                        //console.log('结束日期',new Date(this.stop_date).getTime())
                        return (new Date(val).getTime())-(new Date(this.stopdate).getTime())<=0;
                    },
                    '投放开始日期必须早于投放结束日期'
                ],
                [
                    function(val){

                        return new Date(val).getTime()-new Date(new Date().format().substring(0,10)).getTime()>=0
                    },
                    '开始日期不能小于今天的日期'
                ]
            ]
        },
        stopdate:{
            name:'投放结束日期',
            type:'date',
            format:'y-m-d',
            setVal:{
                reference:'range',
                set:function(refer_val){
                    var arr=refer_val.split(' To ');
                    return arr.length===1?'':(arr[1].trim().substring(0,10));
                }
            }
        },
        range:{
            type:'string',
            name:'投放日期',
            showError:false
        }
    }


    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports=obj;
        }
    } else {
        COGTU.validateRules.ad_plan_modify=obj;
    }
})();