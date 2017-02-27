app.controller('MainController', ['$scope', '$http'], function($scope, $http) {
    $scope.getCutomerRevenue = function() {
        $http({
            method: 'GET',
            url: 'http://localhost:3000/getDriver?driver_device_id=564564564565646456'
        }).then(function successCallback(response) {
            function initialize(data) {
                var myLatlng = new google.maps.LatLng(data.lat, data.lng);
                var mapOptions = {
                    zoom: 20,
                    center: myLatlng
                }
                var map = new google.maps.Map(document.getElementById("map"), mapOptions);

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    title: "Hello World!"
                });
                marker.setMap(map);
            }
        }, function errorCallback(response) {

        });
    };
});
