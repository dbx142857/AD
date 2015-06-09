(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('ad_unit_modifyController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {
                var adcampaign_id;
                if(typeof(baseService.urlParams.adcampaign_id)==='undefined'){


                    $location.url('/');
                    return false;
                }else{
                    adcampaign_id=baseService.urlParams.adcampaign_id;
                }
                $scope.formData={
                    //selectedAdProject:null,
                    adcampaign_name:'',
                    adproject_id:'',
                    //adcampaign_type:'1',
                    user_area_arr:[],
                    user_area:'',
                    user_area_name_str:'',
                    user_area_id_arr:[],
                    user_area_code_arr:[],
                    user_sex:'',
                    device:'',
                    os:null,
                    status:'Y',
                    //user_age:'',
                    ad_id:'',
                    content_tags:'',
                    price:0,
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













                $scope.selectedCitiesCodeArr=[];

                $http.get('/ad_unit_modify/get_current_modified_campaign',{
                    params:{
                        adcampaign_id:adcampaign_id
                    }
                })
                    .then(function(e){
                        if(e.data.status==='ERROR'){
                            layer.alert(e.data.msg);
                            return false;
                        }
                        var data= e.data.result;

                        var item=$scope.current_modified_adcampaign=data[0];

                        $scope.user_area_arr=item.user_area.split(',');

                        var obj={
                            adcampaign_name:item.adcampaign_name,
                            adproject_id:item.adproject_id,
                            user_area:item.user_area,
                            user_sex:item.user_sex,
                            device:item.device,
                            status:item.status,
                            ad_id:item.ad_id,
                            price:item.price/1000000,
                            content_tags:item.content_tags
                        }
                        for(var i in obj){
                            $scope.formData[i]=obj[i];
                        }


                        //tag处理
                        (function(){
                            $scope.visible_of_interests=false;
                            $scope.interest_strs='';


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

                                    $scope.handleModifyInterestsConfig=function(evt){
                                        $scope.visible_of_interests=true;
                                        $scope.formData.content_tags='';
                                        evt.stopPropagation();
                                    }

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
                                                $tar.parent().parent().parent().find(':checkbox').each(function(){
                                                    if($(this).is(':checked')){
                                                        checkedCount++;
                                                    }
                                                })
                                                //console.log('total is:',total,checkedCount===total);
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
                        })();

















                        console.log('item is is:',item)

                        $http.get('/ad_unit_new/get_location')
                            .then(function(e){
                                if(e.data.status==='ERROR'){
                                    layer.alert(e.data.msg);
                                    return false;
                                }
                                var data= e.data.result;
                                var refresh_user_area=function(){
                                    var nv=$scope.formData.user_area_arr;
                                    //console.log('nv is:',nv);
                                    var user_area='',user_area_name_str='',user_area_code_arr=[],user_area_id_arr=[];
                                    for(var i in nv){

                                        var item=nv[i];
                                        if(typeof(item.cities)==='undefined'||item.cities.length===0){
                                            user_area+=item.code+',';
                                            user_area_name_str+=item.name+',';
                                            user_area_code_arr.push(item.code);
                                            user_area_id_arr.push(item.id);
                                        }else{
                                            for(var j in item){
                                                var item_j=item[j];
                                                user_area+=item_j.code+',';
                                                user_area_name_str+=item_j.name+',';
                                                user_area_code_arr.push(item_j.code);
                                                user_area_id_arr.push(item_j.id);
                                            }
                                        }
                                    }
                                    $scope.formData.user_area=user_area;
                                    $scope.formData.user_area_code_arr=user_area_code_arr;
                                    $scope.formData.user_area_name_str=user_area_name_str;
                                    $scope.formData.user_area_id_arr=user_area_id_arr;
                                }


                                $scope.setSelectedCitiesCodeArr=function(item,e){
                                    var $tar=$(e.target);
                                    if($tar.is(':checked')){
                                        $scope.formData.user_area_arr.push(item);
                                    }else{
                                        var id=item.id,index;
                                        for(var i in $scope.formData.user_area_arr){
                                            if($scope.formData.user_area_arr[i].id===id){
                                                index=i;
                                                break;
                                            }
                                        }
                                        $scope.formData.user_area_arr.splice(index,1);
                                    }
                                    refresh_user_area();
                                    //console.log('item is:',item);
                                    console.log('form data is:',$scope.formData);
                                }

                                console.log('form data is:',$scope.formData);
                                $scope.onLocationIsChina=function(){
                                    $scope.formData.user_area='';
                                    $scope.formData.user_area_code_arr=[];
                                    $scope.formData.user_area_name_str='全国';
                                    $scope.formData.user_area_id_arr=[];
                                }


                                $scope.locationIsChina=$scope.formData.user_area.trim()===''?'1':'0';//1表示是中国，0表示自定义
                                if($scope.locationIsChina==='1'){
                                    $scope.onLocationIsChina();
                                }
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
                                            selected:$scope.user_area_arr.indexOf(item.code)!==-1?true:false,
                                            cities:[]
                                        };
                                        if($scope.user_area_arr.indexOf(item.code)!==-1){

                                            $scope.formData.user_area_arr.push(item);
                                            //$scope.formData.user_area_id_arr.push(item.id);
                                        }
                                    }
                                    else if(item.type==='3'){
                                        if($scope.user_area_arr.indexOf(item.code)!==-1){
                                            item.selected=true;
                                            $scope.formData.user_area_arr.push(item);
                                            //$scope.formData.user_area_id_arr.push(item.id);
                                        }else{
                                            item.selected=false;
                                        }
                                        //console.log('city item is:',item)
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
                                if($scope.locationIsChina==='0'){
                                    refresh_user_area();
                                }

                                //console.log('allCitiesSortedByProvince is:',allCitiesSortedByProvince)
                                $scope.allCitiesSortedByProvince=allCitiesSortedByProvince;


                                console.log('allCitiesSortedByProvince',allCitiesSortedByProvince)








                                //$scope.$watch(function(){
                                //    return $scope.locationIsChina;
                                //},function(nv){
                                //    console.log('nv is:',nv);
                                //    if(nv==='1'){
                                //
                                //        $scope.formData.user_area='';
                                //        $scope.formData.user_area_code_arr=[];
                                //        $scope.formData.user_area_name_str='全国';
                                //        $scope.formData.user_area_id_arr=[];
                                //    }
                                //})

                                $scope.osIsNolimited='0';//投放操作系统是否不限制,1表示不限制，0表示自定义
                                $scope.$watch(function(){
                                    return $scope.osIsNolimited;
                                },function(nv){
                                    if(nv==='1'){
                                        $scope.formData.os='';
                                    }
                                })
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
                                for(var i in $scope.oss){
                                    if($scope.oss[i].value===$scope.current_modified_adcampaign.os){
                                        $scope.formData.os=$scope.oss[i]
                                    }
                                }




                                $http.get('/ad_manage/get_all_avaliable_ads')
                                    .then(function(e){
                                        if(e.data.status==='ERROR'){
                                            layer.alert(e.data.msg);
                                            return false;
                                        }
                                        $scope.ads= e.data.result;
                                        //console.log('ads data is:',data);
                                    })


                            })


                    })














                var allowSubmit=true;
                $scope.submit=function(evt){
                    evt.preventDefault();
                    if(!allowSubmit){
                        return false;
                    }
                    allowSubmit=false;



                    if(_.isObject($scope.formData.os)){
                        $scope.formData.os=$scope.formData.os.value;
                    }

                    if($scope.formData.adNewObj.ad_url===''&&$scope.formData.ad_id===''){
                        layer.alert('没有选择广告素材哦');
                        allowSubmit=true;
                        return false;
                    }



                    var params={};
                    params.price=$scope.formData.price*1000000;
                    for(var i in $scope.formData){

                        //user_area_arr:[],
                        //    user_area:'',
                        //    user_area_name_str:'',
                        //    user_area_id_arr:[],
                        //    user_area_code_arr:[],

                        if(['price','adNewObj','user_area_arr','user_area_name_str','user_area_id_arr','user_area_code_arr'].indexOf(i)===-1){
                            params[i]=$scope.formData[i];
                        }
                    }
                    console.log('params is:',params);

                    baseService.update({
                        tableName:'adcampaign',
                        set:params,
                        where:"adcampaign_id='"+adcampaign_id+"'"
                    },function(data){
                        //console.log('url is:',"/ad_unit_manage?adcampaign_id="+adcampaign_id);return false;

                        layer.alert('恭喜亲广告单元修改成功,2秒后跳转到管理广告单元页面');
                        setTimeout(function(){
                            $location.url("/ad_unit_manage?adproject_id="+$scope.formData.adproject_id);
                            layer.closeAll();
                            $scope.$apply();
                        },2000);
                    },function(){
                        allowSubmit=true;
                    })

                    //baseService.insert({
                    //    tableName:'adcampaign',
                    //    set:params
                    //},function(){
                    //    $location.url(CONFIG.AD_UNIT_MANAGE_URL+'?adproject_id='+baseService.urlParams.adproject_id)
                    //})
                }
                $scope.file_upload=function(evt){
                    if(!allowSubmit){
                        return false;
                    }
                    allowSubmit=false;
                    evt.preventDefault();
                    $('div.progress').show();
                    var formData = new FormData();
                    var file = document.getElementById('myFile').files[0];
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
                        $('#imgReadedFromMyfile').attr({
                            src:this.result
                        })
                        //$scope.$apply();
                        console.log('e and this is:',e,this);


                        console.log('formData is:',formData);
                        //for(var i in $scope.formData.adNewObj){
                        //    formData.append(i,$scope.formData.adNewObj[i]);
                        //}
                        //formData.append('adNewObj',$scope.formData.adNewObj);



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
                                //delete params.selectedAdProject;
                                //delete params.adNewObj;
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


                                    //layer.alert('新建素材成功');
                                })
                            }
                            else{
                                allowSubmit=true;
                                layer.alert('系统繁忙，请稍后再试');
                            }
                        };

                        xhr.send(formData);







                    }
                }








            }]);
})();