(function () {
    'use strict';
    angular.module('cogtu.ad')
        .controller('advertisers_overview_reportController', ['$scope', '$location', '$http', 'CONFIG', 'baseService',
            function ($scope, $location, $http, CONFIG, baseService) {


                var date = [moment().format("YYYY-MM-DD")] + " To " + [moment().format("YYYY-MM-DD")];

                document.getElementById("datetimepicker").value = date;


                $scope.reportDataLoad = function () {


                    if (document.getElementById("datetimepicker").value != "") {
                        date = document.getElementById("datetimepicker").value;
                    }


                    $http.get("/advertisers_overview_report/getOverViewTable?userid=" + baseService.user.advertisers_id + "&date=" + date)
                        .success(function (response) {
                            $scope.row = eval(response.data);
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

                $('#datetimepicker').on('apply.daterangepicker', function (ev, picker) {
                    $scope.mapDataLoad();
                    $scope.chartDataLoad();
                    $scope.reportDataLoad();
                });


                $scope.chartDataLoad = function () {

                    if (document.getElementById("datetimepicker").value != "") {
                        date = document.getElementById("datetimepicker").value;
                    }

                    $http.get("/advertisers_overview_report/getChartData?userid=" + baseService.user.advertisers_id + "&date=" + date)
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

                $scope.mapDataLoad = function () {


                    if (document.getElementById("datetimepicker").value != "") {
                        date = document.getElementById("datetimepicker").value;
                    }

                    var mapdata = [];

                    $http.get("/advertisers_overview_report/getMapData?userid=" + baseService.user.advertisers_id + "&date=" + date)
                        .success(function (response) {
                            mapdata = eval(response.data);

                            var myMap = {};
                            for (var i = 0; i < mapdata.length; i++) {
                                myMap[mapdata[i].province] = mapdata[i].imp;
                            }


                            var data = Highcharts.geojson(Highcharts.maps['countries/cn/custom/cn-all-sar-taiwan']), small = $('#area').width() < 400;

                            // 给城市设置随机数据
                            $.each(data, function (i) {

                                this.drilldown = this.properties['hc-key'];


                                if (myMap[this.properties['name']] != null)
                                    this.value = myMap[this.properties['name']];
                                else
                                    this.value = 0;

                            });

                            $('#area').highcharts('Map', {

                                chart: {
                                    events: {
                                        drilldown: function (e) {

                                            this.setTitle(null, {text: cname});
                                        },
                                        drillup: function () {
                                            this.setTitle(null, {text: ''});
                                        }
                                    }
                                },

                                title: {
                                    text: '<b>点击量 - 地域分布图</b>'
                                },

                                subtitle: {
                                    text: '',
                                    floating: true,
                                    align: 'right',
                                    y: 50,
                                    style: {
                                        fontSize: '16px'
                                    }
                                },

                                legend: small ? {} : {
                                    layout: 'vertical',
                                    align: 'right',
                                    verticalAlign: 'middle'
                                },

                                colorAxis: {
                                    min: 0,
                                    minColor: '#FFFFFF',
                                    maxColor: '#005645'
                                },

                                mapNavigation: {
                                    enabled: true,
                                    buttonOptions: {
                                        verticalAlign: 'bottom'
                                    }
                                },

                                series: [{
                                    data: data,
                                    name: '中国',
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.properties.name}'
                                    }
                                }],

                                drilldown: {
                                    activeDataLabelStyle: {
                                        color: '#FFFFFF',
                                        textDecoration: 'none',
                                        textShadow: '0 0 3px #000000'
                                    }

                                }
                            });


                        });


                };

                $scope.reportDataLoad();
                $scope.chartDataLoad();
                $scope.mapDataLoad();




            }]);
})();