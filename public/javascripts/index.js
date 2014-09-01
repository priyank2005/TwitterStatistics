markers = new Array();
var MARKER_TOLERANCE = 40;
var currenC = 0;
$(document).ready(function() {
    loadMap();
    getAllCities();
});
function setMarkers(){
    var myMarkers = markers;
    $("#gmap").gmap3({
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
            $scope.tweets = $scope.tweets.concat(data);
            for (i = 0; i<data.length; i++){
                var arr = new Array();
                //Reverse is understood by GMaps3
                arr[0]=data[i].coordinates[1];
                arr[1]=data[i].coordinates[0];
                addMarkerLocation(arr);
            }
            console.log(data);
        });
    }
]);
var getTweetCountCallback = function(cityName, coodinates) {
    return function(data, textStatus, jqXHR) {
        var s_coordinatesString = coodinates.split(",");
        var i_coodrinate = new Array();
        i_coodrinate[0] = parseFloat(s_coordinatesString[1]);
        i_coodrinate[1] = parseFloat(s_coordinatesString[0]);
        for (j=0; j<data.currentCount; j++){
            markers.push(i_coodrinate);
        }
        setMarkers();
    };
};
function addMarkerLocation(arr){
    markers.push(arr);
    currenC++;
    if (currenC > MARKER_TOLERANCE){
        setMarkers();
        currenC = 0;
    }
}
function getExistingMarkers(){
    $.post('/api/getExistingMarkers', {
            list : "__all"
        },
        function(data, textStatus, jqXHR) {
           for (i=0; i<data.length; i++){
                markers.push(data[i]);
            }
            setMarkers();
        }, 'json');
}
function getAllCities(){
    $.post('/api/getAllSupportedCities', {
            list : "__all"
        },
        function(data, textStatus, jqXHR) {
            var receivedData=0;
            var totalCities=data.length;
            for (i=0; i<totalCities; i++){
                var name=data[i].city;
                $.post('/api/getTweetCountForACity', {
                    "q" : name
                },getTweetCountCallback(data[i].city, data[i].coordinates), 'json');
            }
        }, 'json');
}
function loadMap() {
    $('#gmap').gmap3('destroy').remove();
    $("#mapContainer").html('<div id="gmap" style="height: 100%"></div>');
    if ($("#gmap").length > 0) {
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
            }
        });
    }
}