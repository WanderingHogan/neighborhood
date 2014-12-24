'use strict';

// Places controller
angular.module('places').controller('PlacesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Places',
	function($scope, $stateParams, $location, Authentication, Places ) {
		$scope.authentication = Authentication;

		$scope.message = 'Put the addresses of the places you want to evaluate.'
		var baseLayers = {
			Map: {
				name: 'Basemap',
				switchTo: 'Satellite', //TODO - fix this hack
				url: 'https://{s}.tiles.mapbox.com/v3/hoganmaps.ikkpodh4/{z}/{x}/{y}.png',
				type: 'xyz'
			},
			Satellite: {
				name: 'Satellite',
				switchTo: 'Basemap',
				url: 'https://{s}.tiles.mapbox.com/v3/hoganmaps.jnd4h596/{z}/{x}/{y}.png',
				type: 'xyz'
			}
		};

		angular.extend($scope, {
			tiles: baseLayers.Map,
			center: {
				lat: 39.8,
				lng: -98.6,
				zoom: 4
			},
			defaults: {
				scrollWheelZoom: false,
				zoomControl: false
			}
		});
	}
]);
