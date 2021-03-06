if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        var _=require('underscore');
    }
}
(function(){
    function validate(checkRules,formData,cb,skipClientValidate){


        if(skipClientValidate===true){
            cb({
                status:'OK',
                formData:formData
            });
            return false;
        }
        var err=[];
        if(_.isUndefined(checkRules)){
            err.push('校验规则不能为空');
        }else{
            if(!_.isObject(checkRules)){
                err.push('校验规则必须是一个js对象');
            }
        }
        if(_.isUndefined(formData)){
            err.push('表单数据不能为空');
        }else{
            if(!_.isObject(formData)){
                err.push('表单数据必须是一个js对象');
            }
        }
        var isDate=function(txtDate)
        {
            var currVal = txtDate;
            if(currVal == '')
                return false;

            var rxDatePattern = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/; //Declare Regex
            var dtArray = currVal.match(rxDatePattern); // is format OK?

            if (dtArray == null)
                return false;

            //Checks for mm/dd/yyyy format.
            dtMonth = dtArray[3];
            dtDay= dtArray[5];
            dtYear = dtArray[1];

            if (dtMonth < 1 || dtMonth > 12)
                return false;
            else if (dtDay < 1 || dtDay> 31)
                return false;
            else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
                return false;
            else if (dtMonth == 2)
            {
                var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
                if (dtDay> 29 || (dtDay ==29 && !isleap))
                    return false;
            }
            return true;
        }


        for(var ii in checkRules){
            var val=formData[ii],item=checkRules[ii];

            //console.log('!_.isUndefined(val)',!_.isUndefined(val))
            //console.log('(_.isObject(checkRules))',(_.isObject(checkRules)));
            //console.log('(_.isObject(item))',(_.isObject(item)));

            if(
                (_.isObject(checkRules))
                &&(_.isObject(item))
            ){
                if(!_.isUndefined(item.setVal)){
                    if(
                        (_.isFunction(item.setVal.set))
                        &&(_.isString(item.setVal.reference))
                    ){
                        var setVal=item.setVal;
                        if(_.isUndefined(setVal.reference)){
                            err.push('setVal必须包含一个reference');
                            break;
                        }else{
                            var reference=setVal.reference;
                            if(!_.isString(reference)){
                                err.push('setVal必须包含一个reference,且reference必须是字符串类型');
                                break;
                            }else{
                                var isReferenceExist=function(){
                                    var result=false;
                                    for(var kkk in formData){
                                        if(kkk===reference){
                                            result=true;
                                            break;
                                        }
                                    }
                                    return result;
                                }
                                if(!isReferenceExist()){
                                    err.push('setVal中包含的reference--'+reference+'并不存在');
                                    break;
                                }
                            }
                        }
                        val=item.setVal.set.call(checkRules,formData[reference]);
                        formData[ii]=val;
                    }else{

                        err.push('setVal策略有问题，请仔细检查');
                        break;
                    }
                }
            }else{
                err.push('表单校验规则配置有问题');
                break;
            }


        }

        if(err.length>0){
            if(!_.isUndefined(cb)){
                if(_.isFunction(cb)){
                    cb({
                        status:'ERROR',
                        err:err,
                        formData:formData
                    });
                }else{
                    err.push('第三个参数必须是一个回调函数');
                }

            }

            return false;
        }

        for(var i in checkRules){
            var val=formData[i],item=checkRules[i];
            if(_.isUndefined(val)){
                if(_.isUndefined(item.setVal)){
                    err.push('表单中不存在'+i+'的校验项目');
                    break;
                }

            }
            if(!_.isObject(item)){
                err.push('校验规则必须是一个对象')
            }else{
                if(_.isUndefined(item.name)){
                    if(_.isUndefined(item.showError)||(item.showError===true)){
                        err.push('k为'+i+'的校验项目缺少name属性');
                        break;
                    }

                }
                else if(_.isUndefined(item.type)){
                    err.push('k为'+i+'的校验项目缺少type属性');
                    break;
                }
            }
            //console.log('val item checkRules:',val,item,checkRules);
            if(!_.isUndefined(item.setVal)){
                if(!_.isObject(item.setVal)){
                    err.push('setVal必须是一个object类型');
                    break;
                }else{
                    var setVal=item.setVal;
                    if(_.isUndefined(setVal.reference)){
                        err.push('setVal必须包含一个reference');
                        break;
                    }else{
                        var reference=setVal.reference;
                        if(!_.isString(reference)){
                            err.push('setVal必须包含一个reference,且reference必须是字符串类型');
                            break;
                        }else{
                            var isReferenceExist=function(){
                                var result=false;
                                for(var k in formData){
                                    if(k===reference){
                                        result=true;
                                        break;
                                    }
                                }
                                return result;
                            }
                            if(!isReferenceExist()){
                                err.push('setVal中包含的reference--'+reference+'并不存在');
                                break;
                            }else{

                                if(_.isUndefined(setVal.set)){
                                    err.push('setVal必须包含一个set方法');
                                    break;
                                }else{
                                    if(!_.isFunction(setVal.set)){
                                        err.push('setVal包含的set方法必须是一个function');
                                        break;
                                    }
                                    //else{
                                    //    val=item.setVal.set.call(checkRules,formData[reference]);
                                    //    formData[i]=val;
                                    //}
                                }
                            }
                        }
                    }
                }
            }

            var check_rule=function(){
                if(!_.isUndefined(item.rules)){
                    if(!_.isArray(item.rules)){
                        err.push('规则列表必须是数组');
                    }else{
                        for(var j in item.rules){
                            var rule=item.rules[j];
                            if(rule.length<2){
                                err.push('每一项校验规则里必须有一个校验方法和一个出错提示信息');
                            }else{
                                if(!_.isFunction(rule[0])){
                                    err.push('每一项校验规则的第一项必须是一个function且返回true或者false');
                                }else{
                                    if(!_.isString(rule[1])){
                                        err.push('每一项规则里第二项必须是一个字符串类型的提示信息');
                                    }else{
                                        //console.log('vallllllll',val)
                                        if(rule[0].call(formData,val)!==true){
                                            err.push(rule[1]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


            if(!_.isUndefined(val)){
                if(val===null){
                    if(_.isUndefined(item.showError)||(item.showError===true)){
                        err.push(item.name+'不能为空');
                    }
                }else{
                    if(_.isUndefined(item.type)){
                        err.push('没有声明'+item.name+'字段的类型');
                    }
                    if(_.isUndefined(item.name)){
                        if(_.isUndefined(item.showError)||(item.showError===true)){
                            err.push('没有声明'+item.name+'字段的名称');
                        }

                    }
                    if(item.type==='int'){
                        if(!_.isNumber(val)){
                            err.push(item.name+'必须是整数');
                        }
                        else if(val<=0){
                            err.push(item.name+'必须大于0')
                        }
                        else{
                            check_rule();
                        }
                    }
                    else if(item.type==='string'){
                        if(!_.isString(val)){
                            err.push(item.name+'必须是字符串类型');
                        }
                        else if(val.trim()===''){
                            if(_.isUndefined(item.showError)||(item.showError===true)){
                                err.push(item.name+'不能为空');
                            }

                        }else{
                            check_rule();
                        }
                    }
                    else if(item.type==='date'){
                        if(!_.isString(val)){
                            err.push(item.name+'必须是字符串类型');
                        }
                        else if(val.trim()===''){
                            if(_.isUndefined(item.showError)||(item.showError===true)){
                                err.push(item.name+'不能为空');
                            }

                        }else{
                            if(item.format==='y-m-d'){
                                if(!isDate(val)){
                                    err.push(item.name+'不符合日期类型')
                                }else{
                                    check_rule();
                                }
                            }
                        }
                    }


                }



            }else{
                if(_.isUndefined(item.showError)||(item.showError===true)){
                    err.push(item.name+'不能为空');
                }

            }
        }
        var result;
        if(err.length===0){
            result={
                status:'OK',
                formData:formData
            }
        }else{
            result={
                status:'ERROR',
                err:err,
                formData:formData
            }
        }

        if(!_.isUndefined(cb)){
            if(_.isFunction(cb)){
                cb(result);
            }else{
                err.push('第三个参数必须是一个回调函数');
            }

        }
    }


    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports=validate;
        }
    } else {
        COGTU.validate=validate;
    }
})();