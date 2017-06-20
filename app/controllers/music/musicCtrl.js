angular.module("app").controller("musicCtrl",
    ["$scope", "musicRepo", "$routeParams", "$location", "$timeout", "$filter", "$rootScope", "$window", "$q", "scroller",
	function ($scope, musicRepo, $routeParams, $location, $timeout, $filter, $rootScope, $window , $q, scroller) {

	$scope.cachedData = [];
	$scope.result = {};
	$scope.result.artists = [];
	$scope.result.albums = [];
	$scope.length = 6;
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
	
	$scope.search = function () {
	  $scope.errorMessage = '';
	  $scope.result.artists = [];
	  $scope.result.albums = [];
	  $scope.isLoading = true;
	  musicRepo.search($scope.artistName, 'artist', $scope.access_token).then(function (result){
		  console.log(result);
		  $scope.cachedData.artists = result.data.artists;
		  $scope.updateArtistsResult();
		  $scope.isLoading = false;
	  },
	  function (error){
		  $scope.handleError(error);
	  });
	  
	  $scope.isLoading = true;
	  musicRepo.search($scope.artistName, 'album', $scope.access_token).then(function (result){
		  console.log(result);
		  $scope.cachedData.albums = result.data.albums;
		  $scope.updateAlbumsResult();
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
	
	$scope.showAlbumInfo = function (album) {
		$scope.tracks = null;
		$scope.previewImage = null;
		$scope.selectedArtist = "Loading...";
		$scope.selectedType = 'album';
		$scope.showDialog = true;
		$scope.isInfoLoading = true;
		musicRepo.call(album.href, $scope.access_token).then(function (result){
			$scope.tracks = result.data.tracks;
			$scope.previewImage = album.images[0].url;
			$scope.selectedArtist = album.artists[0].name;
			$scope.isInfoLoading = false;
		}, function (error) {
			$scope.showDialog = false;
			$scope.isInfoLoading = false;
		});
	}
	
	$scope.showArtistInfo = function (artist) {
		$scope.albums = null;
		$scope.previewImage = null;
		$scope.selectedArtist = "Loading...";
		$scope.selectedType = 'artist';
		$scope.showDialog = true;
		$scope.isInfoLoading = true;
		musicRepo.call(artist.href+"/albums?offset=0&limit=50&album_type=album", $scope.access_token).then(function (result){
			$scope.albums = result.data;
			$scope.previewImage = artist.images[0].url;
			$scope.selectedArtist = artist.name;
			$scope.isInfoLoading = false;
		}, function (error) {
			$scope.showDialog = false;
			$scope.isInfoLoading = false;
		});
	}
	
	$scope.loadMore = function () {
		
		if ($scope.cachedData.artists.items.length === 0) {
			if ($scope.cachedData.artists.next)
				$scope.isLoading = true;
			
			musicRepo.call($scope.cachedData.artists.next, $scope.access_token).then(function (result){
				$scope.cachedData.artists = result.data.artists;
				$scope.updateArtistsResult();
				$scope.isLoading = false;
			});
		}
		else
			$scope.updateArtistsResult();
		
		if ($scope.cachedData.albums.items.length === 0) {
			if ($scope.cachedData.albums.next)
				$scope.isLoading = true;
			
			musicRepo.call($scope.cachedData.albums.next, $scope.access_token).then(function (result){
				$scope.cachedData.albums = result.data.albums;
				$scope.updateAlbumsResult();
				$scope.isLoading = false;
			});
		}
		else
			$scope.updateAlbumsResult();
	};
	
	$scope.updateArtistsResult = function () {
		$scope.result.artists = $scope.result.artists.concat($scope.cachedData.artists.items.splice(0, $scope.length));
	}
	
	$scope.updateAlbumsResult = function () {
		$scope.result.albums = $scope.result.albums.concat($scope.cachedData.albums.items.splice(0, $scope.length));
	}
	
	$scope.authorize();
	
}])