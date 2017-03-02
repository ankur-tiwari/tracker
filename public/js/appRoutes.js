angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'partials/home',
			controller: 'MainController'
		})

		.when('/charts', {
			templateUrl: 'partials/chart',
			controller: 'ChartController'
		})

		.when('/movies', {
			templateUrl: 'partials/movie',
			controller: 'MovieController'
		})

		.when('/isotope', {
			templateUrl: 'partials/isotope',
			controller: 'IsotopeController'
		})

		.when('/about', {
			templateUrl: 'partials/about',
			controller: 'AboutController'	
		});

	$locationProvider.html5Mode(true);

}]);