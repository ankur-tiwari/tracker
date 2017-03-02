var app = angular.module('tracker', []);
app.run(['$rootScope', '$http', '$interval', function($rootScope, $http, $interval) {
    $rootScope.getPosition = function() {
        $http({
            method: 'GET',
            url: '/getDriver?driver_device_id=358271063726603'
        }).then(function successCallback(response) {
            initialize(response.data);
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay;

            function initialize(value) {
                directionsDisplay = new google.maps.DirectionsRenderer();
                var myLatlng = new google.maps.LatLng(22.7220951, 75.878494);
                var mapOptions = {
                    zoom: 20,
                    center: myLatlng
                }
                var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                directionsDisplay.setMap(map);
                setMarkers(map, value);
            }

            function setMarkers(map, locations) {
                var marker, i
                for (i = 0; i < locations.length; i++) {
                    var loan = locations[i].device_id;
                    var lat = locations[i].lat;
                    var long = locations[i].lng;
                    var add = locations[i].status;

                    latlngset = new google.maps.LatLng(lat, long);

                    var marker = new google.maps.Marker({
                        map: map,
                        title: loan,
                        position: latlngset
                    });
                    map.setCenter(marker.getPosition())


                    var content = "Status: " + loan

                    var infowindow = new google.maps.InfoWindow()

                    google.maps.event.addListener(marker, 'click', (function(marker, content, infowindow) {
                        return function() {
                            infowindow.setContent(content);
                            infowindow.open(map, marker);
                        };
                    })(marker, content, infowindow));

                   /* var start = new google.maps.LatLng(locations[i].lat, locations[i].lng);
 //var end = new google.maps.LatLng(38.334818, -181.884886);
 var end = new google.maps.LatLng(locations[i + 1].lat, locations[i + 1].lng);
 var request = {
     origin: start,
     destination: end,
     travelMode: google.maps.TravelMode.DRIVING
 };

 var directionsService = new google.maps.DirectionsService();
 directionsService.route(request, function(response, status) {
     if (status == google.maps.DirectionsStatus.OK) {
         directionsDisplay.setDirections(response);
         directionsDisplay.setMap(map);
     } else {
         alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
     }
 });
*/

                }
            }


        }, function errorCallback(response) {

        });
    };
    $rootScope.getPosition();
    $interval($rootScope.getPosition, 20000);
}]);
