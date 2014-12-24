'use strict';

//Setting up route
angular.module('environments').config(['$stateProvider',
	function($stateProvider) {
		// Environments state routing
		$stateProvider.
		state('listEnvironments', {
			url: '/environments',
			templateUrl: 'modules/environments/views/list-environments.client.view.html'
		}).
		state('createEnvironment', {
			url: '/environments/create',
			templateUrl: 'modules/environments/views/create-environment.client.view.html'
		}).
		state('viewEnvironment', {
			url: '/environments/:environmentId',
			templateUrl: 'modules/environments/views/view-environment.client.view.html'
		}).
		state('editEnvironment', {
			url: '/environments/:environmentId/edit',
			templateUrl: 'modules/environments/views/edit-environment.client.view.html'
		});
	}
]);