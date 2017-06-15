(function (window) {
    'use strict';

    angular.module('app').factory('musicRepo', ['$http', '$q', '$window', function ($http, $q, $window) {

		var url = 'https://api.spotify.com/v1/';
		var CLIENT_ID = '';
		var REDIRECT_URI = '';

		//if (location.host == 'localhost:8080') {
			CLIENT_ID =	'3909233d840a44699f6e1ffec6f26701';
			REDIRECT_URI = 'http://localhost:8080/callback'; ///#!/start
		//} else {
		//	CLIENT_ID = '3909233d840a44699f6e1ffec6f26701';
		//	REDIRECT_URI = 'http://www.music.com/callback.html';
		//}
		
		function callEndpoint(endpoint, method, params, data, headers) {
            var deferred = $q.defer();
			
            $http({
              url: url + endpoint,
              method: method ? method : 'GET',
              params: params,
              data: data,
              headers: headers,
              withCredentials: false
            })
            .then(function (data) {
              deferred.resolve(data);
            })
            .catch(function (data) {
              deferred.reject(data);
            });
            return deferred.promise;
	    }
		
		function callApi(url, headers) {
            var deferred = $q.defer();
			
            $http({
              url: url,
              method: 'GET',
              // params: params,
              // data: data,
              headers: headers,
              withCredentials: false
            })
            .then(function (data) {
              deferred.resolve(data);
            })
            .catch(function (data) {
              deferred.reject(data);
            });
            return deferred.promise;
	    }
		
        function toQueryString(obj) {
			var parts = [];
			angular.forEach(obj, function (value, key) {
				this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
			}, parts);
			return parts.join('&');
		};
	  
		function getLoginURL(scopes) {
			return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID
				+ '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
				+ '&scope=' + encodeURIComponent(scopes.join(' '))
				+ '&response_type=token';
		}

		function auth(authToken) {
			var auth = {
              'Authorization': 'Bearer ' + authToken
            };

			return auth;
		}
		
		function search(query, type, token) {			
			var options = {};
            options.q = query;
            options.type = type;
			
			return callEndpoint('search', 'GET', options, null, auth(token));
		}
		
		function call(url, token) {
			return callApi(url, auth(token));
		}
		
		function getTracks(id) {
			return $http.get(url + 'artists/' + id + '/top-tracks?country=US')
		}
		
		var service = {
			authorize: function() {
				
				var deferred = $q.defer();
				var that = this;
				
				var url = getLoginURL([
					'user-read-private',
					'playlist-read-private',
					'playlist-modify-public',
					'playlist-modify-private',
					'user-library-read',
					'user-library-modify',
					'user-follow-read',
					'user-follow-modify'
				]);

				var width = 450,
					height = 730,
					left = (screen.width / 2) - (width / 2),
					top = (screen.height / 2) - (height / 2);

				var w = $window.open(url,
						'Spotify',
						'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
				);
			},
			getAccessToken: function() {
				var token = localStorage.getItem("spotify-token");
				return token;
			},			
			getTokenExpireDate: function() {
				var expires = Number(0 + localStorage.getItem('spotify-expires', '0'));
				if ((new Date()).getTime() >= expires) {
					return '';
				}

				return ((new Date()).getTime() + expires);
			},
			/* setAccessToken: function(token, expires_in) {
				localStorage.setItem('pa_token', token);
				localStorage.setItem('pa_expires', (new Date()).getTime() + expires_in);
			}, */
			getUsername: function() {
				var username = localStorage.getItem('pa_username', '');
				return username;
			},
			setUsername: function(username) {
				localStorage.setItem('pa_username', username);
			},
			getUserCountry: function() {
				var userCountry = localStorage.getItem('pa_usercountry', 'US');
				return userCountry;
			},
			setUserCountry: function(userCountry) {
				localStorage.setItem('pa_usercountry', userCountry);
			},
            search: search,
			call: call,
			getTracks: getTracks
        };

        return service;
    }]);
})();