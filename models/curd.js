var db=require('./database.js');
var lib=require('./lib.js');
var validate=require('./validate.js');

function curd(app){
    app.post('/insert',function(req,res){
        if(typeof(req.body.params.set.createtime)==='undefined'){
            req.body.params.set.createtime=new Date().format();
        }
        if(typeof(req.body.params.set.updatetime)==='undefined'){
            req.body.params.set.updatetime=new Date().format();
        }


        var validate_result=validate(req.body.params.tableName,req.body.params.set);

        console.log('-----------validate_result',validate_result)
        if(validate_result!==true){
            res.send({
                msg:validate_result.msg
            })
            return false;
        }

        db.query("insert into "+req.body.params.tableName+" set ?",req.body.params.set,function(err,result){
            if(err){
                res.send({
                    msg:'系统繁忙，请稍后再试'
                })
            }
            else{
                res.send({
                    status:'OK',
                    result:result
                })
            }
        })
    })
    app.post('/query',function(req,res){

        var fieldName;



        var sql;
        if(req.body.params.where===''){
            req.body.params.where=true;
        }
        var status_condition='';



        if(req.body.params.join!==''){

            var _tableNames=req.body.params.tableName.split(' ');
            var _tableName=_tableNames.length>1?_tableNames[_tableNames.length-1]:_tableNames[0];
            var _fieldName=_tableName[0]==='ad'?'check_status':'status';
            status_condition+=" and "+_tableName+'.'+_fieldName+"!='D'";



            var join=req.body.params.join.split(' ');
            var join_tableName=join.length>1?join[join.length-1]:join[0];
            var join_fieleName=join[0]==='ad'?'check_status':'status';

            status_condition+=" and "+join_tableName+'.'+join_fieleName+"!='D'";
        }else{

            fieldName=req.body.params.tableName==='ad'?'check_status':'status';
            req.body.params.fieldName=fieldName;

            if(['ad','adcampaign','adproject'].indexOf(req.body.params.tableName)!==-1){
                status_condition=' and '+fieldName+"!='D'";
            }
        }


        if(req.body.params.join===''){
            sql=lib.tpl("select {select} from {tableName} where {where}"+status_condition+(req.body.params.groupBy===''?'':' group by {groupBy}'),req.body.params);
        }
        else{
            //status_condition+=" and "+tableName+"."+fieldName

            sql=lib.tpl("select {select} from {tableName} join {join} on {on} where {where}"+status_condition+(req.body.params.groupBy===''?'':' group by {groupBy}'),req.body.params);
        }
        console.log('sql is:',sql);

        setTimeout(function(){
            lib.log('curd log sql is:',sql);
        },2000);

        //console.log('')

        //return false;

        db.query(sql,function(err,result){
            console.log('err is:',err);
            if(err){
                res.send({
                    msg:'系统繁忙，请稍后再试'
                })
            }
            else{
                res.send({
                    status:'OK',
                    result:result
                })
            }
        })
    })

    app.post('/update',function(req,res){

        if(typeof(req.body.params.set)==='undefined'){
            if(typeof(req.body.params.updatetime)==='undefined'){

                req.body.params.updatetime=new Date().format();
            }
        }else{
            if(typeof(req.body.params.set.updatetime)==='undefined'){

                req.body.params.set.updatetime=new Date().format();
            }
        }


        //req.body.params.set.updatetime


        var cb=function(err,result){
            if(err){
                console.log('err is:',err);
                res.send({
                    msg:'系统繁忙，请稍后再试'
                })
            }
            else{
                res.send({
                    status:'OK',
                    result:result
                })
            }
        }


        if(typeof(req.body.params.set)==='undefined'){
            var sql=lib.tpl("update {tableName} set {k}='{v}',updatetime='{updatetime}' where {where}",req.body.params);
            db.query(sql,function(err,result){
                cb(err,result);
            })
        }else{
            var set=req.body.params.set,result='';
            for(var i in set){
                result+=i+"='"+set[i]+"',";
            }
            req.body.params.set=result.substring(0,result.length-1);
            var sql=lib.tpl("update {tableName} set {set} where {where}",req.body.params);
            db.query(sql,function(err,result){
                cb(err,result);
            })
        }

    })

//app.get('/socket_test',function(req,res){
//    console.log(WebSocket)
//    var es   = new WebSocket.EventSource(req, res);
//
//    console.log('es is:',es);
//    es.send('hello,world');
//})







    app.post('/del',function(req,res){

        var fieldName=req.body.params.tableName==='ad'?'check_status':'status';
        req.body.params.fieldName=fieldName;
        var sql=lib.tpl("update {tableName} set {fieldName}='D' where {where}",req.body.params);

        //var sql=lib.tpl("delete from {tableName} where {where}",req.body.params);
        console.log('sql is:',sql);
        db.query(sql,function(err,result){
            if(err){
                console.log('err is:',err);
                res.send({
                    msg:'系统繁忙，请稍后再试'
                })
            }
            else{
                res.send({
                    status:'OK',
                    result:result
                })
            }
        })
    })
    app.post('/count',function(req,res){
        var sql=lib.tpl("select count(*) from {tableName} where {where}",req.body.params);
        //console.log('sql is:',sql);
        db.query(sql,function(err,result){
            if(err){
                res.send({
                    msg:'系统繁忙，请稍后再试'
                })
            }
            else{
                res.send({
                    status:'OK',
                    result:result
                })
            }
        })
    })
}
module.exports=curd;

