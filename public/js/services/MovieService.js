angular.module('MovieService', []).factory('Movie', ['$http', function($http) {
	
	return {
	    // call to GET all movies
	    get : function() {
	        return $http.get('/api/movies');
	    },

	    // call to POST and create a new movie
	    create : function(movieData) {
	        return $http.post('/api/movies', movieData);
	    },

	    // call to DELETE a movie
	    delete : function(id) {
	        return $http.delete('/api/movies/' + id);
	    },

	    // call to PUT and update a movie
	    update : function(movieData) {
	    	return $http.put('/api/movies/' + movieData._id, movieData);
	    }
	} 
	
}]);