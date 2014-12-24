'use strict';

//Setting up route
angular.module('emergencies').config(['$stateProvider',
	function($stateProvider) {
		// Emergencies state routing
		$stateProvider.
		state('listEmergencies', {
			url: '/emergencies',
			templateUrl: 'modules/emergencies/views/list-emergencies.client.view.html'
		}).
		state('createEmergency', {
			url: '/emergencies/create',
			templateUrl: 'modules/emergencies/views/create-emergency.client.view.html'
		}).
		state('viewEmergency', {
			url: '/emergencies/:emergencyId',
			templateUrl: 'modules/emergencies/views/view-emergency.client.view.html'
		}).
		state('editEmergency', {
			url: '/emergencies/:emergencyId/edit',
			templateUrl: 'modules/emergencies/views/edit-emergency.client.view.html'
		});
	}
]);