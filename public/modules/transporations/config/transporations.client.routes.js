'use strict';

//Setting up route
angular.module('transporations').config(['$stateProvider',
	function($stateProvider) {
		// Transporations state routing
		$stateProvider.
		state('listTransporations', {
			url: '/transporations',
			templateUrl: 'modules/transporations/views/list-transporations.client.view.html'
		}).
		state('createTransporation', {
			url: '/transporations/create',
			templateUrl: 'modules/transporations/views/create-transporation.client.view.html'
		}).
		state('viewTransporation', {
			url: '/transporations/:transporationId',
			templateUrl: 'modules/transporations/views/view-transporation.client.view.html'
		}).
		state('editTransporation', {
			url: '/transporations/:transporationId/edit',
			templateUrl: 'modules/transporations/views/edit-transporation.client.view.html'
		});
	}
]);