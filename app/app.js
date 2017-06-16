'use strict';

///**
// * @ngdoc overview
// * @name newappApp
// * @description
// * # newappApp
// *
// * Main module of the application.
// */
/*var app = angular.module("app", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: "app/views/start.html",
		controller: "musicCtrl"
    })
    .when("/start", {
        templateUrl: "app/views/start.html",
        controller: "musicCtrl"
    })
});*/

var app = angular
  .module('app', [
    //'ngAnimate',
    //'ngCookies',
    //'ngResource',
    'ngRoute',
    //'ngSanitize',
    //'ngTouch',
    'oc.lazyLoad',
    'angular-inview',
    'validation',
    'validation.rule'
  ])
  /*.config(function () {
    SpotifyProvider.setClientId('123456789123456789');
    SpotifyProvider.setRedirectUri('http://example.com/callback.html');
    SpotifyProvider.setScope('playlist-read-private');
  })*/
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
							'app/services/scrollerService.js',
                            'app/controllers/music/musicCtrl.js',
							'app/controllers/music/musicRepo.js'
                        ]
                    }]);
                }]
            }
        })
		/*.when('/', {
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
                            '/app/controllers/music/musicCtrl.js',
							'/app/controllers/music/musicRepo.js'
                            // '/app/controllers/mainRepo.js',
                            //'/plugins/something...js'
                        ]
                    }]);
                }]
            }
        })*/
        .otherwise({
            redirectTo: '/start'
        });
});

app.config([
    '$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
            /* modules: [
            ]*/
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
