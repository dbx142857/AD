(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('ad_manageController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {

                $scope.formData={

                    count:null,
                    countY:null,
                    countN:null,
                    countU:null
                }
                $scope.fields="创意标题 图片 链接 审核状态 操作".split(' ');
                $scope.ads=null;
                var init=function(){

                    baseService.count({
                        tableName:'ad',
                        where:"check_status='Y' and advertisers_id="+baseService.user.advertisers_id
                    },function(count){
                        $scope.formData.countY=count;
                        baseService.count({
                            tableName:'ad',
                            where:"check_status='N' and advertisers_id="+baseService.user.advertisers_id
                        },function(count){
                            $scope.formData.countN=count;
                            baseService.count({
                                tableName:'ad',
                                where:"check_status='U' and advertisers_id="+baseService.user.advertisers_id
                            },function(count){
                                $scope.formData.countU=count;
                                $scope.formData.count=$scope.formData.countN+$scope.formData.countY+$scope.formData.countU;
                            })

                        })
                    })

                    $http.get('/ad_manage/get_all_avaliable_ads')
                        .then(function(e){
                            if(e.data.status==='ERROR'){
                                layer.alert(e.data.msg);
                                return false;
                            }
                            console.log('------------------eeeeeeeeeeeee is,',e);
                            $scope.ads= e.data.result;
                        })
                }
                init();

                $scope.delAll=function(arr){

                    baseService.del({
                        tableName:'adcampaign',
                        where:"ad_id in ("+arr.join(',')+")"
                    },function(data){
                        baseService.del({
                            tableName:'ad',
                            where:"ad_id in ("+arr.join(',')+")"
                        },function(data){
                            init();
                        })
                    })






                }

                $scope.del=function(id){
                    baseService.del({
                        tableName:'ad',
                        where:"ad_id='"+id+"'"
                    },function(){
                        init();
                    })
                }
            }]);
})();