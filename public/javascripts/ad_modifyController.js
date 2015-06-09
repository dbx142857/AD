(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('ad_modifyController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {


                var ad_id;
                if(typeof(baseService.urlParams.ad_id)==='undefined'){


                    $location.url('/');
                    return false;
                }else{
                    ad_id=baseService.urlParams.ad_id;
                }



                $http.get('/ad_modify/query_current_modified_ad',{
                    params:{
                        ad_id:ad_id
                    }
                })
                    .then(function(e){
                        if(e.data.status==='ERROR'){
                            layer.alert(e.data.msg);
                            return false;
                        }

                        var data= e.data.result[0];
                        console.log('ad modify data is:',data)
                        $scope.formData={
                            advertisers_id:baseService.user.advertisers_id,
                            ad_name:data.ad_name,
                            //filename:'',
                            landing_page:data.landing_page,
                            //ad_type:1,
                            ad_url:data.ad_url,
                            //size_id:1,
                            check_status:'U',
                            suggest:''
                        }
                    })




                setTimeout(function(){

                    var allowSubmit=true;
                    $scope.submit=function(evt){
                        //$('#uploadBtn').on('click', function(evt) {
                            if(!allowSubmit){
                                return false;
                            }
                        allowSubmit=false;
                            evt.preventDefault();
                            $('div.progress').show();
                            var formData = new FormData();
                            var files = document.getElementById('myFile').files;



                            function submit(){
                                //console.log('res is:',res);



                                //$scope.formData.ad_url=ad_url;
                                var params= $scope.formData;

                                baseService.update({
                                    tableName:'ad',

                                    set:params,
                                    where:"ad_id='"+ad_id+"'"
                                },function(data){

                                    layer.alert('修改素材成功,2s钟后跳转到管理界面');
                                    setTimeout(function(){
                                        $location.url('/ad_manage');
                                        $scope.$apply();
                                        layer.closeAll();
                                    },2000);

                                },function(){
                                    allowSubmit=true;
                                })

                                //baseService.insert({
                                //    tableName:'ad',
                                //    set:params
                                //},function(data){
                                //    $scope.formData.ad_id=data.insertId;
                                //    layer.alert('新建素材成功');
                                //    $location.url('/ad_manage');
                                //})
                            }

                            //console.log('show me the file:',file)
                            if(files.length!==0){
                                var file=files[0];
                                formData.append('myFile', file);
                                console.log('file is:',file)
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

                                var reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload=function(e){
                                    //$scope.fileUpload.readedImgSrc=this.result;
                                    //$('#imgReadedFromMyfile').attr({
                                    //    src:this.result
                                    //})


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
                                        allowSubmit=true;
                                    };

                                    xhr.onload = function() {
                                        allowSubmit=true;
                                        console.log('this is:',this)
                                        var res=JSON.parse(this.responseText);
                                        if(res.status==='OK'){
                                            var upload_dir=CONFIG.UPLOAD_FILE_DIR.split('/');
                                            var index=upload_dir.indexOf('public');
                                            upload_dir.splice(index,1);
                                            upload_dir=upload_dir.join('/');
                                            $scope.formData.ad_url=upload_dir+res.file.name;
                                            $scope.$apply();

                                            $http.get("/cdn/save_cdn",{
                                                params:{
                                                    ad_id:ad_id,
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
                                                        layer.alert('系统繁忙，请稍后重试');
                                                        allowSubmit=true;
                                                    }else{
                                                        $http.post('/ad/save_ad_url',{
                                                            params:{
                                                                ad_id:ad_id,
                                                                ad_url:data
                                                            }
                                                        })
                                                            .then(function(e){
                                                                allowSubmit=true;

                                                                if(e.data.status==='OK'){
                                                                    console.log('cdn rename success');
                                                                    $scope.formData.ad_url=data;
                                                                    submit();
                                                                }else{
                                                                    layer.alert('系统繁忙，请稍后重试');
                                                                }
                                                            })
                                                    }
                                                })


                                        }else{
                                            allowSubmit=true;
                                        }
                                    };

                                    xhr.send(formData);







                                }
                            }else{
                                submit();
                            }




                        //});
                    }

                })
            }]);
})();