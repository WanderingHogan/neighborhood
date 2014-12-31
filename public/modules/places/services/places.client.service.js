'use strict';

//Places service used to communicate Places REST endpoints
angular.module('places').factory('Places', ['$resource', '$http', '$q',
	function($resource, $http, $q) {

		function getGeocode(input) {
			console.log(encodeURIComponent(input).replace(/%20/g, "+"));
			var request = $http({
				method: 'get',
				url: 'http://geocoder.api.here.com/6.2/geocode.json',
				params: {
					app_id: '8bx61rumb54eBl6gciU9',
					app_code: 'TZBRe91PU3N3v8NqAFA7QA',
					//searchtext: encodeURIComponent(input).replace(/%20/g, "+"),
					searchtext: input,
					gen: '8'
				}
			});
			return( request.then( handleSuccess, handleError ) );
		}

		function handleSuccess( response ) {
			return( response );

		}

		function handleError( response ) {
			console.log('error');

			// The API response from the server should be returned in a
			// nomralized format. However, if the request was not handled by the
			// server (or what not handles properly - ex. server error), then we
			// may have to normalize it on our end, as best we can.
			if (
				! angular.isObject( response.data ) ||
				! response.data.message
			) {

				return( $q.reject( 'An unknown error occurred.' ) );

			}

			// Otherwise, use expected error message.
			return( $q.reject( response.data.message ) );

		}

		return ({
			getGeocode: getGeocode
		});

	}
]);
