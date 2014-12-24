'use strict';

//Emergencies service used to communicate Emergencies REST endpoints
angular.module('emergencies').factory('Emergencies', ['$resource',
	function($resource) {
		return $resource('emergencies/:emergencyId', { emergencyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);