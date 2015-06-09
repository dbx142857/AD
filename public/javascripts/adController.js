(function(){
    'use strict';
    angular.module('cogtu.ad')
        .controller('adController', ['$scope','$location','$http','CONFIG','baseService',
            function($scope,$location,$http,CONFIG,baseService) {
                //$location.url(CONFIG.AD_PLAN_LIST_URL);
                //var AD_URL_CONFIG=CONFIG.AD_URL_CONFIG;
                //$http.get(CONFIG.AD_URL+'/'+AD_URL_CONFIG.GET_ALL_ADPROJECT)
                //    .then(function(e){
                //        $scope.adprojects= e.data.adprojects;
                //        //console.log('e is:',e);
                //    })
            }]);
})();