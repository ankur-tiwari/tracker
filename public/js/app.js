angular.module('meanApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'MovieCtrl', 'MovieService', 'ChartCtrl', 'ChartService', 'AboutCtrl', 'AboutService', 'IsotopeCtrl', 'IsotopeService', 'iso.directives', 'ui.bootstrap', 'xeditable', 'chart.js'])
.controller('HeaderController', function($scope, $location) {
  $scope.isActive = function (viewLocation) {
    return $location.path().indexOf(viewLocation) >= 0;
  };
}).controller('FooterController', function($scope, $location) {

})

