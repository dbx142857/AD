(function(){
   'use strict';

    var getScope=function($p){
        var getParentScope=function(){

            if($p.$parent.$parent.$parent!==null){
                $p=$p.$parent;
                getParentScope();
            }
        }
        getParentScope();
        return $p;
    }
    var getAllCheckbox=function($tar){

        return $tar.closest('table').find(':checkbox').slice(1);
    }
    var getCheckAllHandlerCheckbox=function($tar){
        return $tar.closest('table').find(':checkbox').first();
    }


    angular
        .module('cogtu.ad', [
            'ngRoute',
            'ui.bootstrap'
            //,'ngAnimate'
            //,'ui.router'
        ])
        .directive('inheritLayout',[function(){

            return {
                restrict:'EA',
                templateUrl:function(element,attrs){
                    return attrs.parent;
                },
                transclude:true,
                link:function($scope,$element,$attr){
                    jQuery($element).addClass('inherit-layout');
                }
            }
        }])
        .directive('multiCheckAll',[function(){
            return {
                restrict:'EA',
                template:'<input type="checkbox">',
                replace:true,
                link:function($scope,$element,$attr){

                    var $p=getScope($scope);



                    $($element).on('click',function(e){

                        //if(typeof($p['lastMultiCheckAllBox'])==='undefined'){
                            var $tar=$p['$lastMultiCheckAllBox']=$(e.target);
                        //}

                        var $checkboxes=getAllCheckbox($tar),total=$checkboxes.size();
                        var arr=$p['multi_select_arr'];
                        if(arr.length<total){
                            $checkboxes.each(function(){
                                if(!$(this).is(':checked')){
                                    $(this).click();
                                }
                            })

                        }else{
                            $checkboxes.each(function(){
                                if($(this).is(':checked')){
                                    $(this).click();
                                }
                            })

                        }
                    })

                    //console.log('$p is:',$p);
                    //$($element).on('click',function(){
                    //    if($p['multi_select_arr'].length!==0){
                    //        $p[$attr.handler].call(this,$p['multi_select_arr']);
                    //        $p['multi_select_arr']=[];
                    //    }
                    //
                    //})
                }
            }
        }])
        .directive('multiHandler',[function(){
            return {
                restrict:'EA',
                template:'<button>{{value}}</button>',
                replace:true,
                scope:{

                    value:'@'
                },
                link:function($scope,$element,$attr){

                    var $p=getScope($scope);
                    //console.log('$p is:',$p);
                    $($element).on('click',function(e){
                        if($p['multi_select_arr'].length!==0){
                            $p[$attr.handler].call(this,$p['multi_select_arr']);
                            $p['multi_select_arr']=[];

                            $p['$lastMultiCheckAllBox'].prop('checked',false);

                            //getCheckAllHandlerCheckbox($(e.target)).prop('checked',false);

                            //var $obj=getCheckAllHandlerCheckbox($(e.target));
                            //console.log('obj size:',$obj.size());
                            ////console.log('$obj is checked ?:',$obj.is(':checked'),$obj.size(),$obj.parent().html());
                            //if($obj.is(':checked')){
                            //    $obj.click();
                            //}
                            //$obj.removeAttr('checked');



                        }

                    })
                }
            }
        }])
        .directive('multiCheck',[function(){
            return {
                restrict:'EA',
                template:'<input type="checkbox"/>',
                replace:true,
                link:function($scope,$element,$attr){
                    //console.log('attr is:',$attr);
                    //console.log('scope is:',$scope);




                    var $p=getScope($scope);


                    var idSaver='multi_select_arr';
                    //console.log('id saver is:',idSaver,$p[idSaver]);
                    if(typeof($p[idSaver])==='undefined'){
                        $p[idSaver]=[];
                        //console.log('$p now is:',$p);
                    }
                    var $e=$($element);
                    //$p['$lastMultiCheckAllBox']
                    $e.on('click',function(e){
                        if(angular.isUndefined($p['$lastMultiCheckAllBox'])){
                            $p['$lastMultiCheckAllBox']=getCheckAllHandlerCheckbox($(e.target));
                        }
                        var $tar=$(e.target);
                        var id=parseInt($attr.multiId,10);
                        if($tar.is(':checked')){
                            $p[idSaver].push(id);
                        }else{
                            var index=$p[idSaver].indexOf(id);
                            $p[idSaver].splice(index,1);
                        }

                        var $tar=$(e.target);
                        var $checkAllHandlerCheckbox=getCheckAllHandlerCheckbox($tar);
                        var total=getAllCheckbox($tar).size();
                        console.log('total and multi_select_arr',total,$p['multi_select_arr'])
                        if(total===$p['multi_select_arr'].length){
                            $checkAllHandlerCheckbox.prop('checked',true);
                        }else{
                            $checkAllHandlerCheckbox.prop('checked',false);
                        }

                        //console.log('$p[idSaver] is:',$p[idSaver])
                    })

                }
            }
        }])
        //.directive('cardsLayout',[function(){
        //    console.log("hello world")
        //    return {
        //        restrict:'EA',
        //        template:'',
        //        link:function($scope,$element,$attr){
        //            console.log('attr is:',$attr);
        //        }
        //    }
        //}]);
})();