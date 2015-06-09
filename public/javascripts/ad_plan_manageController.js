(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('ad_plan_manageController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {

                //$(document).click(function(){
                //    console.log($scope);
                //})
                $scope.formData={

                    results:[],
                    countY:null,
                    countN:null,
                    count:null

                }

                var clickrates={

                }
                var fun=function(e){
                    var data= e.data;
                    for(var i in data){
                        var item=data[i];
                        clickrates[item.project_id]={
                            imp:item.imp,
                            click:item.click,
                            clickrate:item.clickrate
                        }
                    }
                    $scope.clickrates=clickrates;
                    //console.log($scope.clickrates)
                }

                $http.get('/yesterday_campaign_value/getProject')
                    .then(function(e){
                        fun(e);
                    },function(){
                        $http.get('/yesterday_campaign_value/getProject')
                            .then(function(e){
                                fun(e);
                            })
                    })

                $scope.countUnitByPlan={

                }


                $http.get('/ad_plan_manage/get_all_unit_count_for_all_plan')
                    .then(function(e){
                        if(e.data.status==='ERROR'){
                            layer.alert(e.data.msg);
                            return false;
                        }
                        var data= e.data.result;
                        console.log('thissssssssss is the data:',data);
                        for(var i in data){
                            var item=data[i],count=item['COUNT(c.adcampaign_id)'],id=item.adproject_id;
                            if(angular.isUndefined($scope.countUnitByPlan[id])){
                                $scope.countUnitByPlan[id]={
                                    countN:0,
                                    countY:0
                                };
                            }
                            if(item.status==='N'){
                                $scope.countUnitByPlan[id].countN=count;
                            }
                            else if(item.status==='Y'){
                                $scope.countUnitByPlan[id].countY=count;
                            }
                        }
                        console.log('$scope.countUnitByPlan is:',$scope.countUnitByPlan)
                    })







                $scope.fields="计划名称 状态 总预算 每日预算 展现量 点击量 点击率 推广单元 操作".split(' ');
                var init=function(cb){

                    $http.get('/ad_plan_manage/get_all_available_plan')
                        .then(function(e){
                            if(e.data.status==='ERROR'){
                                layer.alert(e.data.msg);
                                return false;
                            }
                            $scope.formData.results= e.data.result;
                            console.log('adprojectttttttttttttttttt data is:',$scope.formData.results);
                        })


                    if(typeof(cb)!=='undefined'){
                        cb();
                    }

                    baseService.count({
                        tableName:'adproject',
                        where:"status='Y' and advertisers_id="+baseService.user.advertisers_id
                    },function(count){
                        $scope.formData.countY=count;
                        baseService.count({
                            tableName:'adproject',
                            where:"status='N' and advertisers_id="+baseService.user.advertisers_id
                        },function(count){
                            $scope.formData.countN=count;
                            $scope.formData.count=$scope.formData.countN+$scope.formData.countY;
                        })
                    })
                }
                var allowSetStatus=true;
                var setAll=function(s,arr){
                    baseService.update({
                        tableName:'adproject',
                        k:'status',
                        v:s,
                        where:"adproject_id in ("+arr.join(',')+")"
                    },function(data){
                        init(function(){
                            allowSetStatus=true;
                        });
                    })
                }
                $scope.openAll=function(arr){
                    setAll('Y',arr);
                }
                $scope.pauseAll=function(arr){
                    setAll('N',arr);
                }
                $scope.delAll=function(arr){

                    baseService.del({
                        tableName:'adcampaign',
                        where:"adproject_id in ("+arr.join(',')+")"
                    },function(data){
                        baseService.del({
                            tableName:'adproject',
                            where:"adproject_id in ("+arr.join(',')+")"
                        },function(data){
                            init(function(){
                                allowSetStatus=true;
                            });
                        })
                    })




                }
                $scope.setStatus=function(status,id){
                    if(allowSetStatus){
                        allowSetStatus=false;
                        baseService.update({
                            tableName:'adproject',
                            k:'status',
                            v:status,
                            where:"adproject_id='"+id+"'"
                        },function(data){
                            //$scope.formData.selectedCampaign.status=status;
                            init(function(){
                                allowSetStatus=true;
                            });
                        })
                    }
                }
                $scope.del=function(id){
                    baseService.del({
                        tableName:'adproject',
                        where:"adproject_id='"+id+"'"
                    },function(data){
                        console.log('delete data is:',data);
                        init();
                    })
                }
                init();
            }]);
})();