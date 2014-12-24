'use strict';

//Environments service used to communicate Environments REST endpoints
angular.module('environments').factory('Environments', ['$resource',
	function($resource) {
		return $resource('environments/:environmentId', { environmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);