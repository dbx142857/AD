(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('ad_plan_modifyController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {

                var adproject_id;
                if(typeof(baseService.urlParams.adproject_id)==='undefined'){


                    $location.url('/');
                    return false;
                }else{
                    adproject_id=baseService.urlParams.adproject_id;
                }

                $http.get('/ad_plan_modify/get_current_modified_plan',{
                        params:{
                            adproject_id:adproject_id
                        }
                })
                    .then(function(e){
                        if(e.data.status==='ERROR'){
                            layer.alert(e.data.msg);
                            return false;
                        }
                        console.log('------------this is the e:',e)
                        var data= e.data.result[0];
                        var setNum=function(num){
                            return num>9?num:('0'+num);
                        }
                        $scope.range=new Date(data.start_date).format().substring(0,10)+' To '+new Date(data.stop_date).format().substring(0,10);
                        //$('#datetimepicker').val(new Date(data.start_date).format()+' To '+new Date(data.stop_date).format());
                        $scope.formData={
                            adproject_id:adproject_id,
                            adproject_name:data.adproject_name,
                            budget_day:data.budget_day/1000000,
                            budget:data.budget/1000000,
                            time_ranges:data.time_ranges,
                            start_date:data.start_date,
                            stop_date:data.stop_date
                        }

                        var days={}
                        var time_ranges_arr=data.time_ranges.split(' ');
                        for(var i in time_ranges_arr){
                            time_ranges_arr[i]=parseInt(time_ranges_arr[i]);
                        }
                        for(var i=1;i<8;i++){
                            days[i]={
                                checked:time_ranges_arr.indexOf(i)===-1?false:true,
                                name:'周'+('一 二 三 四 五 六 日'.split(' ')[i-1])
                            }
                        }
                        $scope.days=days;


                        setTimeout(function(){
                            $('#start_date,#stop_data').daterangepicker({
                                singleDatePicker: true
                            });
                        },1000)
                    })




                var allowSubmit=true;
                $scope.submit=function(){

                    if(!allowSubmit){
                        return false;
                    }
                    allowSubmit=false;

                    //------------------------
                    var formData=$.extend(_.clone($scope.formData),{
                        range:$('#datetimepicker').val().trim(),
                        budget:parseInt($scope.formData.budget)*1000000,
                        budget_day:parseInt($scope.formData.budget_day)*1000000,
                        test:'hello world'
                    });
                    console.log('$scope.formData',$scope.formData)
                    //var isFormLegal=true;
                    COGTU.validate(COGTU.validateRules.ad_plan_new, formData,function(res){
                        if(res.status==='ERROR'){
                            allowSubmit=true;
                            console.log('client error')
                            layer.alert(res.err.join('<br>'));
                            //isFormLegal=false;
                        }
                        if(res.status==='OK'){
                            $http.post('/ad_plan_modify',{
                                params:{
                                    formData:formData
                                }
                            })
                                .then(function(e){
                                    allowSubmit=true;
                                    if(e.data.status==='ERROR'){
                                        layer.alert(e.data.msg);
                                    }else{
                                        layer.alert('操作成功,2s钟后跳转到管理页面');
                                        setTimeout(function(){
                                            $location.url(CONFIG.AD_PLAN_MANAGE_URL);
                                            $scope.$apply();
                                            layer.closeAll();
                                        },2000);

                                    }
                                })
                        }
                    });
                }


                //var allowSubmit=true;
                //$scope.submit=function(){
                //
                //    if(!allowSubmit){
                //        return false;
                //    }
                //    allowSubmit=false;
                //    var range=$('#datetimepicker').val().trim();
                //    var arr=range.split('To');
                //    $scope.formData.start_date=arr[0].trim();
                //    if(arr.length>1){
                //        $scope.formData.stop_date=arr[1].trim();
                //    }
                //
                //    $scope.formData.budget_day=parseInt($scope.formData.budget_day)*1000000;
                //    $scope.formData.budget=parseInt($scope.formData.budget)*1000000;
                //    //return false;
                //    baseService.update({
                //        tableName:'adproject',
                //        set:$scope.formData,
                //        where:"adproject_id='"+adproject_id+"'"
                //    },function(res){
                //        console.log('res is:',res);
                //        layer.alert('操作成功');
                //        $location.url(CONFIG.AD_PLAN_MANAGE_URL);
                //        allowSubmit=true;
                //    })
                //}



                $scope.set_time_range=function(){
                    var arr=[];
                    for(var i in $scope.days){
                        var item=$scope.days[i];
                        console.log('item is:',item);
                        if(item.checked===true){
                            arr.push(i);
                        }
                    }
                    $scope.formData.time_ranges=arr.join(' ');
                    console.log('teime ranges:',$scope.time_ranges)
                }
                $scope.custom_time_ranges=function(index,e){
                    console.log(index,e);
                    if($(e.target).is(':checked')){
                        $scope.days[index+1].checked=true;
                    }else{
                        $scope.days[index+1].checked=false;
                    }
                    $scope.set_time_range();
                }
















            }]);
})();