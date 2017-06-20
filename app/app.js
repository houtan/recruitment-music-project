'use strict';

var app = angular
  .module('app', [
    'ngCookies',
    'oc.lazyLoad',
    'angular-inview',
    'validation',
    'validation.rule',
	'ngRoute'
  ])
.config(function ($routeProvider) {

    $routeProvider
        .when('/start', {
            templateUrl: 'app/views/start.html',
            controller: 'musicCtrl',
            data: {
                header: 'header-transparent'
            },
            resolve: {
                lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'app',
                        files: [
							'app/services/scrollerService.js'
						]
                    }]).then(function () {
						return $ocLazyLoad.load([{
							name: 'app',
							files: [
								'app/controllers/music/musicCtrl.js',
								'app/controllers/music/musicRepo.js'
							]
						}]);
					});
                }]
            }
        })
        .otherwise({
            redirectTo: '/start'
        });
});

app.config([
    '$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
        });
    }
]);

app.run(function ($rootScope, $window) {
    $rootScope.$on('$routeChangeStart', function () {
		console.log('routeChangeStart ...');
    });

    $rootScope.$on('$locationChangeSuccess', function () {
        if ($window.Appcues) {
            $window.Appcues.start();
        }
    });

    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function () {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function () {
            $rootScope.online = true;
        });
    }, false);
});
