'use strict';

$(document).ready(function() {
    loadMap();
});

var app = angular.module('app', ['appControllers', 'appServices', 'appDirectives', 'appFilters']);
var appControllers = angular.module('appControllers', []);
var appServices = angular.module('appServices', []);
var appDirectives = angular.module('appDirectives', []);
var appFilters = angular.module('appFilters', []);

appControllers.controller('TweetCtrl', ['$scope', 'socket',
    function TweetCtrl($scope, socket) {
        socket.emit('tweet-io:start', true);
        $scope.tweets = [];
        socket.on('tweet-io:tweets', function(data) {
            console.log(data);
            $scope.tweets = $scope.tweets.concat(data);
        });
    }
]);

function loadMap() {
    $('#gmap').gmap3('destroy').remove();
    $("#mapContainer").html('<div id="gmap" style="height: 100%"></div>');
    if ($("#gmap").length > 0) {
        var myMarkers = [
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275],
            [51.5072, 0.1275]
        ];
        $('#gmap').gmap3({
            action: 'destroy'
        });
        var map = $("#gmap").gmap3({
            map: {
                options: {
                    maxZoom: 14,
                    center: new google.maps.LatLng('54.2500', '4.5000'),
                    zoom: 6,
                    disableDefaultUI: true,
                    mapTypeControl: false,
                    panControl: false,
                    zoomControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    rotateControlOptions: false,
                    overviewMapControl: false,
                    OverviewMapControlOptions: false
                }
            },

            marker: {
                values: myMarkers,
                cluster: {
                    radius: 100,
                    events: { // events trigged by clusters 
                        click: function(cluster) {
                            console.log(cluster);
                            $("#gmap").gmap3({
                                map: {
                                    options: {
                                        center: cluster.main.getPosition(),
                                        zoom: cluster.main.map.zoom + 1
                                    }
                                }
                            })
                        }
                    },
                    0: {
                        content: "<div class='cluster cluster-1'>CLUSTER_COUNT</div>",
                        width: 53,
                        height: 52
                    },
                    20: {
                        content: "<div class='cluster cluster-2'>CLUSTER_COUNT</div>",
                        width: 56,
                        height: 55
                    },
                    50: {
                        content: "<div class='cluster cluster-5'>CLUSTER_COUNT</div>",
                        width: 66,
                        height: 65
                    }
                }
            }
        });
    }
}
