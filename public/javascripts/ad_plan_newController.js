(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('ad_plan_newController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {

                $scope.formData={
                    adproject_name:'',
                    budget:null,
                    budget_day:null,
                    time_ranges:'1 2 3 4 5 6 7',
                    start_date:'',
                    stop_date:''
                }

                setTimeout(function(){
                    $('#start_date,#stop_data').daterangepicker({
                        singleDatePicker: true
                    });
                },1000)
                var allowSubmit=true;
                $scope.submit=function(){

                    if(!allowSubmit){
                        return false;
                    }
                    allowSubmit=false;
                    //console.log('$scope.formData',$scope.formData)
                    //------------------------
                    var formData=$.extend(_.clone($scope.formData),{
                        range:$('#datetimepicker').val().trim(),
                        budget:parseInt($scope.formData.budget)*1000000,
                        budget_day:parseInt($scope.formData.budget_day)*1000000
                    });
                    //var isFormLegal=true;
                    console.log('$scope.formData',$scope.formData)
                    COGTU.validate(COGTU.validateRules.ad_plan_new, formData,function(res){
                        if(res.status==='ERROR'){
                            allowSubmit=true;
                            console.log('client error')
                            layer.alert(res.err.join('<br>'));
                            //isFormLegal=false;
                        }
                        if(res.status==='OK'){
                            $http.post('/ad_plan_new',{
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


                var days={}
                for(var i=1;i<8;i++){
                    days[i]={
                        checked:true,
                        name:'周'+('一 二 三 四 五 六 日'.split(' ')[i-1])
                    }
                }
                $scope.days=days;
                $scope.daysStr='';
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