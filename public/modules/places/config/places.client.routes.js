'use strict';

//Setting up route
angular.module('places').config(['$stateProvider',
	function($stateProvider) {
		// Places state routing
		$stateProvider.
		state('listPlaces', {
			url: '/places',
			templateUrl: 'modules/places/views/places.client.view.html'
		});
	}
]);
