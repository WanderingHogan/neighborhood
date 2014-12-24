'use strict';

//Transporations service used to communicate Transporations REST endpoints
angular.module('transporations').factory('Transporations', ['$resource',
	function($resource) {
		return $resource('transporations/:transporationId', { transporationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);