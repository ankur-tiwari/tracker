angular.module('IsotopeCtrl', []).controller('IsotopeController', function($scope, $http, Asset) {

	$scope.tagline = "Grabbing your Assets";	

	$scope.isoInit = function() {
		$scope.assets = grabAssets();
	}

	function grabAssets() {
		// console.log('grabbing movies')
		Asset.get().success(function (assets) {
			// movies.sort(yearSort)
			$scope.assetCount = assets.length + ' assets'
			$scope.assets = assets
		});
	}
});