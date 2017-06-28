angular.module("app").controller("musicCtrl",
    ["$scope", "musicRepo", "$routeParams", "$location", "$timeout", "$filter", "$rootScope", "$window", "$q", "scroller",
	function ($scope, musicRepo, $routeParams, $location, $timeout, $filter, $rootScope, $window , $q, scroller) {

	$scope.cachedData = [];
	$scope.cachedData.all = [];
	$scope.result = {};
	$scope.result.all = [];
	$scope.length = 12;
	$scope.artistName = '';
	$scope.tracks = {};
	$scope.albums = {};
	$scope.access_token = '';
	$scope.authError = false;
	$scope.expires = false;
	$scope.errorMessage = '';
	$scope.previewImage = '';
	$scope.selectedArtist = '';
	$scope.isInfoLoading = false;
	$scope.isLoading = false;
	$scope.isLoaded = false;

    console.log('init');
	
	$scope.scrollTo = function (element){
      scroller.scrollTo(element);
    };
	
	$scope.$on('$viewContentLoaded', function(){
      $scope.isLoaded = true;
	});
	
	$scope.authorize = function () {
	  $scope.access_token = musicRepo.getAccessToken();
	  
	  if ($scope.access_token === '' || $scope.access_token === undefined || $scope.access_token === null)
	  {
		$scope.authError = true;
		musicRepo.authorize();
	  }
	  /*else
	  {
		$scope.expireDate = musicRepo.getTokenExpireDate();
		if ($scope.expireDate === '' || $scope.expireDate === null)
		{
		  $scope.expires = true;
		  $scope.authError = true;
		}
	  }*/
    };
	
	$scope.resetValues = function () {
	  $scope.errorMessage = '';
	  $scope.result.all = [];
	  $scope.cachedData = [];
	  $scope.cachedData.all = [];
	}
	
	$scope.search = function () {
	  $scope.resetValues();
	  $scope.isLoading = true;
	  musicRepo.search($scope.artistName, 'artist', $scope.access_token).then(function (result){
		  console.log(result);
		  result.data.artists.type = 'artist';
		  $scope.mergeResults(result.data.artists);
		  $scope.updateResult();
		  $scope.isLoading = false;
	  },
	  function (error){
		  $scope.handleError(error);
	  });
	  
	  $scope.isLoading = true;
	  musicRepo.search($scope.artistName, 'album', $scope.access_token).then(function (result){
		  console.log(result);
		  result.data.albums.type = 'album';
		  $scope.mergeResults(result.data.albums);
		  $scope.updateResult();
		  $scope.isLoading = false;
	  },
	  function (error){
		  $scope.handleError(error);
	  });
    };
	
	$scope.handleError = function (error) {
		$scope.closed = false;
		if (error.data)
		{
			$scope.errorMessage = error.data.error.message;
			if (error.data.error.message.indexOf("expire") !== -1)
			{
				$scope.authError = true;
				musicRepo.authorize();
			}
		}
	    else
		  $scope.errorMessage = "unknown error !";
	
	    $scope.isLoading = false;
	}
	
	$scope.showAlbumInfo = function (item) {
		$scope.tracks = null;
		$scope.previewImage = null;
		$scope.selectedArtist = "Loading...";
		$scope.selectedType = 'album';
		$scope.showDialog = true;
		$scope.isInfoLoading = true;
		musicRepo.call(item.href, $scope.access_token).then(function (result){
			$scope.tracks = result.data.tracks;
			$scope.previewImage = item.images[0].url;
			$scope.selectedArtist = item.artists[0].name;
			$scope.isInfoLoading = false;
		}, function (error) {
			$scope.showDialog = false;
			$scope.isInfoLoading = false;
		});
	}
	
	$scope.showArtistInfo = function (item) {
		$scope.albums = null;
		$scope.previewImage = null;
		$scope.selectedArtist = "Loading...";
		$scope.selectedType = 'artist';
		$scope.showDialog = true;
		$scope.isInfoLoading = true;
		musicRepo.call(item.href+"/albums?offset=0&limit=50&album_type=album", $scope.access_token).then(function (result){
			$scope.albums = result.data;
			$scope.previewImage = item.images[0].url;
			$scope.selectedArtist = item.name;
			$scope.isInfoLoading = false;
		}, function (error) {
			$scope.showDialog = false;
			$scope.isInfoLoading = false;
		});
	}
	
	$scope.loadMore = function () {
		
		if ($scope.cachedData.all.length === 0) {
			if ($scope.cachedData.next_artists || $scope.cachedData.next_albums)
				$scope.isLoading = true;
			
			if ($scope.cachedData.next_artists)
				musicRepo.call($scope.cachedData.next_artists, $scope.access_token).then(function (result){
				
					result.data.artists.type = 'artist';
					$scope.mergeResults(result.data.artists);
					$scope.updateResult();
					$scope.isLoading = false;
				}, function (error) {
					$scope.isLoading = false;
				});
			
			if ($scope.cachedData.next_albums)
				musicRepo.call($scope.cachedData.next_albums, $scope.access_token).then(function (result){

					result.data.albums.type = 'album';
					$scope.mergeResults(result.data.albums);
					$scope.updateResult();
					$scope.isLoading = false;
				}, function (error) {
					$scope.isLoading = false;
				});
		}
		else
			$scope.updateResult();
	};
	
	$scope.mergeResults = function (list) {
		$scope.cachedData.all = $scope.cachedData.all.concat(list.items);
		
		if (list.type === 'artist')
			$scope.cachedData.next_artists = list.next;
		
		if (list.type === 'album')
			$scope.cachedData.next_albums = list.next;
	}
	
	$scope.updateResult = function () {
		$scope.result.all = $scope.result.all.concat($scope.cachedData.all.splice(0, $scope.length));
		$scope.result.next_artists = $scope.cachedData.next_artists;
		$scope.result.next_albums = $scope.cachedData.next_albums;
	}
	
	$scope.authorize();
	
}])