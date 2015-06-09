(function(){
'use strict';
angular.module('cogtu.ad')
.controller('ad_newController', ['$scope','$location','$http','CONFIG','baseService',
function($scope,$location,$http,CONFIG,baseService) {

    $scope.formData={
        advertisers_id:baseService.user.advertisers_id,
        ad_name:'',
        //filename:'',
        landing_page:'',
        //ad_type:1,
        ad_url:''
        //size_id:1,
        //status:'U'
    }


    var allowSubmit=true;
    $scope.submit=function(evt){

        //console.log('sdfdfdf')
        evt.preventDefault();
        if(!allowSubmit){
            return false;
        }
        allowSubmit=false;

        var file = document.getElementById('myFile').files[0];

        console.log('file is:',file)
        if(typeof(file)==='undefined'){
            layer.alert('请选择文件后再上传哦');
            allowSubmit=true;
            return false;

        }
        if(file.size/1024/1024>CONFIG.MAX_UPLOAD_FILE_SIZE){
            layer.alert('文件大小超过'+CONFIG.MAX_UPLOAD_FILE_SIZE+'mb'+',无法上传哦');
            allowSubmit=true;
            return false;

        }
        var ext=file.name.split('.').reverse()[0];
        if(['jpg','png'].indexOf(ext)===-1){
            layer.alert('文件类型不合法，只允许jpg和png类型的');
            allowSubmit=true;
            return false;

        }

        $('div.progress').show();
        var formData = new FormData();
        formData.append('myFile', file);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=function(e){
            //$scope.fileUpload.readedImgSrc=this.result;
            $('#imgReadedFromMyfile').attr({
                src:this.result
            })
            //$scope.$apply();
            console.log('e and this is:',e,this);


            console.log('formData is:',formData);



            var xhr = new XMLHttpRequest();

            xhr.open('post', '/ad/upload', true);

            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    var percentage = (e.loaded / e.total) * 100;
                    $('div.progress div.bar').css('width', percentage + '%');
                }
            };

            xhr.onerror = function(e) {
                layer.alert('An error occurred while submitting the form. Maybe your file is too big');
            };

            xhr.onload = function() {
                console.log('this is:',this)
                var res=JSON.parse(this.responseText);
                if(res.status==='OK'){
                    console.log('res is:',res);


                    var upload_dir=CONFIG.UPLOAD_FILE_DIR.split('/');
                    var index=upload_dir.indexOf('public');
                    upload_dir.splice(index,1);
                    upload_dir=upload_dir.join('/');
                    $scope.formData.ad_url=upload_dir+res.file.name;
                    var params= $scope.formData;

                    //if(!baseService.validateFormBeforeSubmit(params,{
                    //        ad_name:'创意标题',
                    //        ad_url:'选择的广告文件',
                    //        landing_page:'关联url'
                    //    })){
                    //    allowSubmit=true;
                    //    return false;
                    //
                    //}

                    baseService.insert({
                        tableName:'ad',
                        set:params
                    },function(data){

                        $scope.formData.ad_id=data.insertId;

                        $http.get("/cdn/save_cdn",{
                            params:{
                                ad_id:$scope.formData.ad_id,
                                file:(function(){
                                    var STATIC_FOLDER=CONFIG.STATIC_FOLDER;
                                    var url=$scope.formData.ad_url;
                                    url=url.substring(1);
                                    return STATIC_FOLDER+url;
                                })(),
                                ext:ext
                            }
                        })
                            .then(function(e){
                                var data= e.data;
                                if(data==='error!'){
                                    allowSubmit=true;
                                    layer.alert('系统繁忙，请稍后重试');
                                }else{
                                    $http.post('/ad/save_ad_url',{
                                        params:{
                                            ad_id:$scope.formData.ad_id,
                                            ad_url:data
                                        }
                                    })
                                        .then(function(e){
                                            allowSubmit=true;
                                            if(e.data.status==='OK'){
                                                layer.alert('新建素材成功,2s钟后跳转到管理界面');
                                                setTimeout(function(){
                                                    $location.url('/ad_manage');
                                                    $scope.$apply();
                                                    layer.closeAll();
                                                },2000);

                                            }else{
                                                layer.alert('系统繁忙，请稍后重试');
                                            }
                                        })
                                    }
                            })


                    },function(){
                        allowSubmit=true;
                    })
                }else{
                    allowSubmit=true;
                }
            };

            xhr.send(formData);







        }
    }

    
}]);
})();