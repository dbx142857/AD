(function () {
    'use strict';
    angular.module('cogtu.ad')
        .controller('advertisers_ad_reportController', ['$scope', '$location', '$http', 'CONFIG', 'baseService',
            function ($scope, $location, $http, CONFIG, baseService) {

                var date = [moment().format("YYYY-MM-DD")] + " To " + [moment().format("YYYY-MM-DD")];

                document.getElementById("datetimepicker").value = date;

                $scope.reportDataLoad = function () {
                    if ($scope.currentPage == null)
                        $scope.currentPage = 0;

                    if (document.getElementById("datetimepicker").value != "") {
                        date = document.getElementById("datetimepicker").value;
                    }

                    var proid = 0
                    if ($scope.selpro != null) {
                        proid = $scope.selpro.adproject_id;
                    }

                    var camid = 0
                    if ($scope.selcam != null) {
                        camid = $scope.selcam.adcampaign_id;
                    }


                    $http.get("/advertisers_ad_report/getAdTable?proid=" + proid + "&camid=" + camid + "&date=" + date + "&currentPage=" + $scope.currentPage)
                        .success(function (response) {
                            $scope.row = eval(response.data);
                            $scope.currentPage = response.currentPage;
                            $scope.totalPage = response.totalPage;
                        });
                }

                $('#datetimepicker').daterangepicker({

                    format: "YYYY-MM-DD",
                    separator: ' To ',
                    locale: {
                        customRangeLabel: '自定义范围'
                    },
                    ranges: {
                        '今天': [moment(), moment()],
                        '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
                        '最近 7 天': [moment().subtract('days', 6), moment()],
                        '最近 15 天': [moment().subtract('days', 6), moment()],
                        '最近 1 月': [moment().startOf('month'), moment().endOf('month')],
                        '最近 3 月': [moment().subtract('month', 2).startOf('month'), moment().subtract('month').endOf('month')]
                    }
                });

                //$('#datetimepicker').on('apply.daterangepicker', function (ev, picker) {
                //    $scope.currentPage = null;
                //    $scope.chartDataLoad();
                //    $scope.reportDataLoad();
                //});


                //读取下拉框
                $scope.selectDataLoad = function () {

                    $http.get("/advertisers_campaign_report/getSelectData")
                        .success(function (response) {
                            $scope.pros = response;
                        });
                }

                //下拉框更新
                $scope.update = function (selectedValue) {

                    $scope.selcam = null;
                    $scope.cams = null;
                    $scope.cams = selectedValue.campaign;
                };

                $scope.chartDataLoad = function () {

                    if (document.getElementById("datetimepicker").value != "") {
                        date = document.getElementById("datetimepicker").value;
                    }

                    var proid = 0
                    if ($scope.selpro != null) {
                        proid = $scope.selpro.adproject_id;
                    }

                    var camid = 0
                    if ($scope.selcam != null) {
                        camid = $scope.selcam.adcampaign_id;
                    }

                    $http.get("/advertisers_ad_report/getChartData?proid=" + proid + "&camid=" + camid + "&date=" + date)
                        .success(function (response) {

                            $('#container11').highcharts({
                                title: {
                                    text: '',
                                    x: -20 //center
                                },

                                yAxis: {
                                    min: 0,
                                    title: {
                                        text: ''
                                    },
                                    plotLines: [{
                                        value: 0,
                                        width: 1,
                                        color: '#808080'
                                    }]
                                },

                                tooltip: {
                                    valueSuffix: ''
                                },

                                legend: {
                                    layout: 'vertical',
                                    align: 'right',
                                    verticalAlign: 'middle',
                                    borderWidth: 0
                                },

                                xAxis: {
                                    categories: response.categories
                                },

                                series: response.series

                            });
                        });


                };

                $scope.reportExcelExport = function () {

                    if (document.getElementById("datetimepicker").value != "") {
                        date = document.getElementById("datetimepicker").value;
                    }

                    var proid = 0
                    if ($scope.selpro != null) {
                        proid = $scope.selpro.adproject_id;
                    }

                    var camid = 0
                    if ($scope.selcam != null) {
                        camid = $scope.selcam.adcampaign_id;
                    }


                    var url = "/advertisers_ad_report/Excel?camid=" + camid + "&proid=" + proid + "&date=" + date;
                    window.location = url;

                }

                $scope.selectDataLoad();
                $scope.chartDataLoad();
                $scope.reportDataLoad();


            }]);
})();