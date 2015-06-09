(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('ad_unit_newController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {
                if(typeof(baseService.urlParams.adproject_id)==='undefined'){


                    $location.url('/');
                    return false;
                }

                $scope.formData={
                    //selectedAdProject:null,
                    adcampaign_name:'',
                    adproject_id:'',
                    //adcampaign_type:'1',
                    user_area:'',
                    user_sex:'',
                    device:'',
                    os:'',
                    status:'Y',
                    //user_age:'',
                    ad_id:'',
                    price:0,
                    content_tags:'',
                    adNewObj:{//新建的创意
                        advertisers_id:baseService.user.advertisers_id,
                        ad_name:'',
                        //filename:'',
                        landing_page:'',
                        //ad_type:1,
                        ad_url:''
                        //size_id:1,
                        //status:'U'
                    }
                };

                //tag处理
                (function(){
                    $scope.tag1=null;//备用标签
                    $scope.tag2=null;//线上标签
                    $scope.selectedTags=[];

                    $http({
                        url:'/tag/get_all_tags',
                        method:'get',
                        'Content-Type':'application/json;charset=utf-8'
                    })
                        .then(function(e){
                            //console.log('tag标签的e：',e);
                            //console.log('e.data.result[0].tag_tree',e.data.result[0].tag_tree);
                            var tags= JSON.parse(e.data.result[0].tag_tree).tags;
                            tags=unflat(tags);

                            console.log('刚刚unflat之后的元素是:',tags);



                            var _tags={};
                            for(var i in tags){
                                var item=tags[i];
                                //if(item.isLeaf===false){
                                    _tags[i]=item;
                                //}
                            }
                            console.log('_tags is:',_tags);
                            var tag1=_tags[0],tag2=_tags[1];
                            //for(var i in _tags){
                            //    var item=_tags[i];
                            //    if(i!==0&&i!==1){
                            //        if(item.parent==='1'){
                            //            tag2.children[i]=item;
                            //        }else if(item.parent==='0'){
                            //            tag1.children[i]=item;
                            //        }
                            //    }
                            //}
                            $scope.countObj=function(obj){
                                var count=0;
                                for(var i in obj){
                                    count++;
                                }
                                return count;
                            }
                            console.log('tag2 is--------:',tag2);
                            $scope.tag1=tag1.children;
                            $scope.tag2=tag2.children;
                            $scope.tag1_name=tag1.name;
                            $scope.tag2_name=tag2.name;
                            console.log('tag1 name: ', tag1.name);
                            console.log('tag2 name: ', tag2.name);
                            console.log('tag1 and tag2 is:',$scope.tag1, $scope.tag2);

                            $scope.handle_tag_click=function(id,$event,isSelectAll){
                                id=parseInt(id);

                                var $tar=$($event.target);
                                if(isSelectAll===true){

                                    if($tar.is(':checked')){
                                        var _ids=[];
                                        $tar.parent().parent().next().find(':checkbox').each(function(){
                                            $(this).prop('checked',true);
                                            _ids.push(parseInt($(this).attr('tag_id')));
                                        })
                                        $scope.selectedTags=$scope.selectedTags.concat(_ids);
                                        console.log('$scope.selectedTags is:',$scope.selectedTags)
                                    }else{
                                        //multiSplice
                                        var _ids=[];
                                        $tar.parent().parent().next().find(':checkbox').each(function(){
                                            $(this).prop('checked',false);
                                            _ids.push(parseInt($(this).attr('tag_id')));
                                        })
                                        $scope.selectedTags= $.multiSplice($scope.selectedTags,_ids);
                                        console.log('$scope.selectedTags is:',$scope.selectedTags)
                                    }
                                }else{

                                    if($tar.is(':checked')){
                                        $scope.selectedTags.push(id);
                                        $tar.prop('checked',true);
                                        var $tarp=$tar.parent().parent().parent().prev().find(':checkbox').first(),
                                            total=parseInt($tarp.attr('total'));

                                        var checkedCount=0;
                                        console.log('size-----------:',$tar.parent().parent().parent().find(':checkbox').size())
                                        $tar.parent().parent().parent().find(':checkbox').each(function(){
                                            if($(this).is(':checked')){
                                                checkedCount++;
                                            }
                                        })
                                        console.log('total is:',total,checkedCount,checkedCount===total);
                                        if(checkedCount===total){
                                            $tarp.prop('checked',true);
                                        }
                                    }else{
                                        var index=$scope.selectedTags.indexOf(id);
                                        $scope.selectedTags.splice(index,1);
                                        $tar.prop('checked',false);
                                        $tar.parent().parent().parent().prev().find(':checkbox').prop('checked',false);
                                    }
                                    console.log('$scope.selectedTags is:',$scope.selectedTags)
                                }
                                setTimeout(function(){
                                    $scope.formData.content_tags=$scope.selectedTags.join(',');
                                    $scope.$apply();
                                })
                            }



                            function unflat(flatArr) {
                                var hash = {'-1': {id: '-1', layer: 0}};
                                var tree = {};
                                for (var i = 0; i < flatArr.length; i++) {
                                    hash[flatArr[i].id] = flatArr[i];
                                }
                                var root = null;
                                for (var i = 0; i < flatArr.length; i++) {
                                    var tmp = flatArr[i];
                                    if ('children' in hash[tmp.parent]) {
                                        hash[tmp.parent].children.push(tmp);
                                    } else {
                                        hash[tmp.parent].children = [tmp];
                                    }
                                }
                                // BFS
                                root = hash['-1'];
                                var queue = [root.id];
                                while (queue.length) {
                                    var tmp = queue.shift();
                                    var curLayer = hash[tmp].layer;
                                    if ('children' in hash[tmp]) {
                                        for (var i = 0; i < hash[tmp].children.length; i++) {
                                            var c = hash[tmp].children[i];
                                            hash[c.id].layer = curLayer + 1;
                                            queue.push(c.id);
                                        }
                                    }
                                }



                                console.log('刚刚处理之后的hash是:',hash);
                                var _hash={};
                                for(var i in hash){
                                    _hash[hash[i].id]=hash[i];
                                }

                                //for(var i in _hash){
                                //    if(_.isArray(_hash[i].children)){
                                //        var _tmp={};
                                //        for(var j in _hash[i].children){
                                //            //var item=_hash[_hash[i].children[j]];
                                //            var item=_hash[i].children[j];
                                //            //console.log('items is:',item);
                                //            _tmp[item.id]= _.clone(_hash[_hash[i].children[j]]);
                                //            //_hash[i].children[j]= _.clone(_hash[item]);
                                //            //delete _hash[item];
                                //        }
                                //        _hash[i].children=_tmp;
                                //    }
                                //}
                                //console.log('hash is:',hash);
                                console.log('_hash is:',_hash);

                                return _hash;

                            }



                        })
                })()








                var allowSubmit=true;
                $scope.submit=function(){

                    if(!allowSubmit){
                        return false;
                    }
                    allowSubmit=false;


                    if($scope.formData.os!==''&& _.isObject($scope.formData.os)){
                        $scope.formData.os=$scope.formData.os.value;
                    }

                    //if($scope.formData.content_tags)
                    if($scope.formData.adcampaign_name.trim()===''){
                        layer.alert('广告名称不能为空哦');
                        allowSubmit=true;
                        return false;
                    }
                    if($scope.formData.adNewObj.ad_url===''&&$scope.formData.ad_id===''){
                        layer.alert('没有选择广告素材哦');
                        allowSubmit=true;
                        return false;
                    }

                    $scope.formData.price*=1000000;
                    $scope.formData.adproject_id=baseService.urlParams.adproject_id;

                    var params={};
                    for(var i in $scope.formData){
                        if(i!=='adNewObj'){
                            params[i]=$scope.formData[i];
                        }
                    }
                    console.log('params is:',params);
                    baseService.insert({
                        tableName:'adcampaign',
                        set: $.extend(params,{
                            advertisers_id:baseService.user.advertisers_id
                        })
                    },function(){
                        layer.alert('新建广告单元成功,2秒后跳转到管理广告单元页面');
                        allowSubmit=false;
                        setTimeout(function(){
                            $location.url(CONFIG.AD_UNIT_MANAGE_URL+'?adproject_id='+baseService.urlParams.adproject_id);
                            layer.closeAll();
                            $scope.$apply();
                        },2000);

                    },function(){
                        allowSubmit=true;
                    })
                }

                $scope.file_upload=function(evt){
                    if(!allowSubmit){
                        return false;
                    }
                    allowSubmit=false;
                    //console.log('sdfdfdf')
                    evt.preventDefault();

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
                                $scope.formData.adNewObj.ad_url=upload_dir+res.file.name;
                                var params= $scope.formData.adNewObj;

                                //if(!baseService.validateFormBeforeSubmit(params,{
                                //        ad_name:'创意标题',
                                //        ad_url:'选择的广告文件',
                                //        landing_page:'关联url'
                                //    })){
                                //    return false;
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
                                                var url=$scope.formData.adNewObj.ad_url;
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
                                                        ad_id:$scope.formData.ad_id,
                                                        ad_url:data
                                                    }
                                                })
                                                    .then(function(e){
                                                        allowSubmit=true;

                                                        if(e.data.status==='OK'){
                                                            layer.alert('新建素材成功');
                                                            //$location.url('/ad_manage');
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


                $scope.selectedCitiesCodeArr=[];
                $scope.setSelectedCitiesCodeArr=function(code,e){
                    var $tar=$(e.target);
                    if($tar.is(':checked')){
                        $scope.selectedCitiesCodeArr.push(code);
                    }else{
                        var index=$scope.selectedCitiesCodeArr.indexOf(code);
                        $scope.selectedCitiesCodeArr.splice(index,1);
                    }
                    $scope.formData.user_area=$scope.selectedCitiesCodeArr.join(',')
                }

                $scope.locationIsChina='1';//1表示是中国，0表示自定义

                $scope.osIsNolimited='1';//投放操作系统是否不限制,1表示不限制，0表示自定义

                $scope.$watch(function(){
                    return $scope.locationIsChina;
                },function(nv){
                    if(nv==='1'){
                        $scope.formData.user_area='';
                    }
                })
                $scope.$watch(function(){
                    return $scope.osIsNolimited;
                },function(nv){
                    if(nv==='1'){
                        $scope.formData.os='';
                    }
                })
                $scope.testt=function(){
                    alert("this is test")
                }
                //$scope.oss=['不限','IOS7','IOS8','Android2.0','Android2.1'];
                $scope.oss=[
                    {
                        name:'不限',
                        value:''
                    },{
                        name:'IOS7',
                        value:'IOS,7'
                    },{
                        name:'Android2.0',
                        value:'Android,2.0'
                    }
                ]
                $scope.formData.os=$scope.oss[0]



                $http.get('/ad_manage/get_all_avaliable_ads')
                    .then(function(e){
                        if(e.data.status==='ERROR'){
                            layer.alert(e.data.msg);
                            return false;
                        }
                        $scope.ads= e.data.result;
                        //console.log('ads data is:',data);
                    })


                $http.get('/ad_unit_new/get_location')
                    .then(function(e){
                        if(e.data.status==='ERROR'){
                            layer.alert(e.data.msg);
                            return false;
                        }
                        var data= e.data.result;
                        $scope.locations= data;
                        var provinces=[];
                        var cities=[];
                        var allCitiesSortedByProvince={};
                        for(var i in $scope.locations){
                            var item=$scope.locations[i];
                            if($scope.locations[i].type==='2'){
                                provinces.push(item);
                                allCitiesSortedByProvince[item.id]={
                                    name:item.name,
                                    code:item.code,
                                    cities:[]
                                };
                            }
                            else if(item.type==='3'){
                                cities.push(item)
                            }
                        }
                        //$scope.provinces=provinces;

                        for(var i in provinces){

                            for(var j in cities){
                                if(cities[j].parent_id===provinces[i].id){
                                    allCitiesSortedByProvince[provinces[i].id].cities.push(cities[j]);
                                }
                            }
                        }
                        //console.log('allCitiesSortedByProvince is:',allCitiesSortedByProvince)
                        $scope.allCitiesSortedByProvince=allCitiesSortedByProvince;
                    })






            }]);
})();