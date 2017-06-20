angular.module("app").controller("mainCtrl",
    ["$scope", "$routeParams", "$location", "$timeout", "$filter", "$rootScope", "$window",'$q',
function ($scope, $routeParams, $location, $timeout, $filter, $rootScope, $window , $q) {

    $scope.sdata = "hootan alavizadeh";

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