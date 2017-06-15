angular.module("app").controller("mainCtrl",
    ["$scope", "$routeParams", "$location", "$timeout", "$filter", "$rootScope", "$window",'$q',
function ($scope, $routeParams, $location, $timeout, $filter, $rootScope, $window , $q) {

    $scope.sdata = "hootan";
	console.log('routeParams:');
	console.log($routeParams);
	
	console.log('url:');
	console.log($location.url);
	console.log($window.returnValue);

    // console.log($scope.sdata);

    $scope.goto = function (path)
    {
        $location.path(path);
    }

    $scope.backToHome = function ()
    {
        $location.path("/");
    }

    $scope.backButton = function ()
    {
        $window.history.back();
    };

}])