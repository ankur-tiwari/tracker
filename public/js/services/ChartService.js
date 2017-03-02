angular.module('ChartService', []).factory('Chart', ['$http', function($http) {
	return {
	    // call to GET all assets
	    get : function() {
	        return $http.get('/api/assets');
	    }
	}
}]);