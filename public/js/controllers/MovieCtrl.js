angular.module('MovieCtrl', []).controller('MovieController', function($scope, $http, Movie) {

	$scope.tagline = "Go ahead, make my day";
// grabMovies();
	$scope.grabMovies = function () { grabMovies(); }

	$scope.ratingScale = [
	    {value: 1, text: '1'},
	    {value: 2, text: '2'},
	    {value: 3, text: '3'},
	    {value: 4, text: '4'},
	    {value: 5, text: '5'}
	  ]; 

	

	$scope.createMovie = function (isValid) {
		if (!isValid) return;
		// if (!$scope.newMovieTitle || !$scope.newMovieYear || !$scope.newMovieDirector) return;
		// console.log('creating movie', $scope.newMovieTitle, $scope.newMovieYear, $scope.newMovieDirector)

		var newMovie = {
			title: $scope.newMovieTitle,
			year: +$scope.newMovieYear,
			director: $scope.newMovieDirector
		}

		Movie.create(newMovie).then(function successCallback(response) {
			// console.log('success')
			$scope.hasPlot = false;
			$scope.saveSuccess = true;
			$scope.saveError = false;
			$scope.msgText = "'" + $scope.newMovieTitle + "' sucessfully saved!";
			$scope.newMovieTitle = $scope.newMovieYear = $scope.newMovieDirector ='';
			grabMovies();
		}, function errorCallback(response) {
			// console.log('error')
			// console.log(response)
			$scope.hasPlot = false;
			$scope.saveSuccess = false;
			$scope.saveError = true;
			$scope.msgText = "Save Error!! " + response.data.error.errmsg
		})
	}

	$scope.delMovie = function (id) {
		// console.log('deleting from controller', id)
		Movie.delete(id).success(function (data) {
			grabMovies();
		});
	}

	$scope.showDelConf = function() {
		$scope.isDeleting = true;
	}
	$scope.hideDelConf = function() {
		$scope.isDeleting = false;
	}

	$scope.checkTitle = function(data) {
		if (!data) return "Title is required"
		// console.log('checking title')
    	// return "something";
	}
	$scope.checkYear = function(data) {
		if (!data) return "Year is required"
    	// return "yyyy"
	}
	$scope.checkDirector = function(data) {
		if (!data) return "Director is required"
    	// return "err"
	}

	$scope.toggleRating = function(self, movie) {
		// console.log(self)
	    movie.watched = self.$data;
	  };

	$scope.saveMovie = function(data, id) {
    	
    	angular.extend(data, {_id: id});
    	if (!data.watched) data.rating = 0;
		// console.log(data)
    	Movie.update(data).success(function (result) {
    		grabMovies();
    	});
	 }

	$scope.onSelect = function($item, $model, $label) {
		// console.log($item)
		var selected = $item.split(' | ');
		$scope.newMovieTitle = selected[0];
		$scope.newMovieYear = +selected[1];
		getDirector(selected[0]);
	}

	$scope.selected = undefined;
	
	// Any function returning a promise object can be used to load values asynchronously
	$scope.getMovies = function(val) {
		$scope.queryUrl = 'http://www.omdbapi.com/?type=movie&r=json&s=' + encodeURIComponent(val) + '*'
		return $http.get('//www.omdbapi.com/', {
		  params: {
		  	type: 'movie',
		  	r: 'json',
		    s: val + '*'
		  }
		}).then(function(response){
			// console.log(response)
			if (response.data.Error) {
				if (response.data.Error.indexOf("Timeout expired") > -1) return
				return [response.data.Error]
			}
			return response.data.Search.map(function(item) {
				return item.Title + ' | ' + item.Year;
			})
		});
	};
	function getDirector (val) {
		$scope.queryUrl = 'http://www.omdbapi.com/?r=json&t=' + encodeURIComponent(val)
		return $http.get('//www.omdbapi.com/?r=json', {
		  params: {
		  	r: 'json',
		    t: val
		  }
		}).then(function(response){
			// console.log(response.data)
			if (response.data.Error) return response.data.Error
			$scope.hasPlot = true;
			$scope.thePlot = response.data.Plot
			return $scope.newMovieDirector = response.data.Director
		});
	};

	function grabMovies() {
		// console.log('grabbing movies')
		Movie.get().success(function (movies) {
			// movies.sort(yearSort)
			$scope.movieCount = movies.length + ' movies'
			$scope.movies = movies
		});
	}
});