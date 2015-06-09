(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('ad_unit_manageController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {

                console.log('$location:',$location);

                if(typeof(baseService.urlParams.adproject_id)==='undefined'){


                    $location.url('/');
                    return false;
                }
                $scope.fields="推广名称 推广图片 推广链接 出价 状态 展现量 点击量 点击率 总消耗 操作".split(' ');
                $scope.formData={
                    adproject_id:baseService.urlParams.adproject_id,
                    all_projects:null,
                    selectedProject:null,
                    statusText:'',
                    countY:null,
                    countN:null,
                    unitOfSelectedProject:null
                }

                var clickrates={

                }
                var fun=function(e){
                    var data= e.data;
                    //item.campaign_id

                    for(var i in data){
                        var item=data[i];
                        clickrates[item.campaign_id]={
                            imp:item.imp,
                            click:item.click,
                            clickrate:item.clickrate
                        }
                    }
                    $scope.clickrates=clickrates;


                    var totalConsumption={};
                    $http.get('/totalConsumption')
                        .then(function(ee){
                            if(e.data.status==='ERROR'){
                                layer.alert(e.data.msg);
                                return false;
                            }
                            console.log('ee is:',ee)
                            for(var i in ee.data){
                                var item=ee.data[i];
                                totalConsumption[item.campaign_id]=item['SUM(money)+SUM(coupon)'];
                            }
                            $scope.totalConsumption=totalConsumption;
                            console.log('totalConsumption is:',totalConsumption)
                        })



                }

                $http.get('/yesterday_campaign_value/getCampaign',{
                    params:{
                        project_id:baseService.urlParams.adproject_id
                    }
                })
                    .then(function(e){
                        fun(e);
                    },function(){
                        $http.get('/yesterday_campaign_value/getCampaign',{
                            params:{
                                project_id:baseService.urlParams.adproject_id
                            }
                        })
                            .then(function(e){
                                fun(e);
                            })
                    })


                var isCurProjectExist=false;
                var init=function(cb){

                    $http.get('/ad_plan_manage/get_all_available_plan')
                        .then(function(e){
                            if(e.data.status==='ERROR'){
                                layer.alert(e.data.msg);
                                return false;
                            }
                            var data= e.data.result;
                            console.log('adprojecttttttttttttt---------ttttt data is:',e.data.result);
                            $scope.formData.all_projects=data;
                            console.log('project data is:',data)
                            for(var i in data){
                                if(parseInt(data[i].adproject_id,10)===parseInt(baseService.urlParams.adproject_id,10)){
                                    isCurProjectExist=true;
                                    $scope.formData.selectedProject=data[i];
                                }
                            }

                            if(isCurProjectExist===false){
                                $location.url('/');
                                return false;
                            }
                            if(typeof($scope.formData.selectedProject.adproject_id)!=='undefined'){
                                setCount($scope.formData.selectedProject.adproject_id);
                            }

                            console.log('result',data)
                            if(typeof(cb)!=='undefined'){
                                cb();
                            }
                        })



                }

                var setAll=function(s,arr){
                    baseService.update({
                        tableName:'adcampaign',
                        k:'status',
                        v:s,
                        where:"adcampaign_id in ("+arr.join(',')+")"
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
                        where:"adcampaign_id in ("+arr.join(',')+")"
                    },function(data){
                       init();
                    })




                }

                var allowSetStatus=true;
                $scope.setStatus=function(status,id){
                    if(allowSetStatus){
                        allowSetStatus=false;
                        baseService.update({
                            tableName:'adcampaign',
                            k:'status',
                            v:status,
                            where:"adcampaign_id='"+id+"'"
                        },function(data){
                            //$scope.formData.selectedProject.status=status;
                            init(function(){
                                allowSetStatus=true;
                            });
                        })
                    }
                }
                var setCount=function(project_id){

                    console.log('project id:',project_id)

                    $http.get('/ad_unit_manage/get_unit_count',{
                        params:{
                            adproject_id:project_id
                        }
                    })
                        .then(function(e){
                            if(e.data.status==='ERROR'){
                                layer.alert(e.data.msg);
                                return false;
                            }
                            var data= e.data.result;
                            console.log('----eeeeeeeeee-----------:',e);
                            console.log('join data join data is:',data)
                            $scope.formData.unitOfSelectedProject=data;
                            console.log('unitOfSelectedProject is:',$scope.formData.unitOfSelectedProject)
                            var countY= 0,countN=0;
                            for(var i in data){
                                var item=data[i];
                                if(item.status==='Y'){
                                    countY++;
                                }else{
                                    countN++;
                                }
                            }
                            $scope.formData.countY=countY;
                            $scope.formData.countN=countN;
                        })






                }

                $scope.del=function(id){

                    baseService.del({
                        tableName:'adcampaign',
                        where:"adcampaign_id='"+id+"'"
                    },function(data){
                        console.log('data is:',data);
                        init();
                    })
                }
                init();

                $scope.$watch(function(){
                    return $scope.formData.selectedProject;
                },function(nv){
                    console.log('nv',nv)
                    if(nv!=null&&typeof(nv.adproject_id)!=='undefined'){
                        $location.url(CONFIG.AD_UNIT_MANAGE_URL+'?adproject_id='+nv.adproject_id)
                    }

                })


            }]);
})();