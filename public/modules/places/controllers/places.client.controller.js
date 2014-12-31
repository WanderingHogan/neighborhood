'use strict';

// Places controller
angular.module('places').controller('PlacesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Places', 'leafletEvents',
	function($scope, $stateParams, $location, Authentication, Places, leafletEvents ) {
		$scope.authentication = Authentication;

		$scope.myMarkers = {
			marker_1: {
				icon: 'modules/core/img/map_icons/number_1.png',
				model_name: 'number_1'
			},
			marker_2: {
				icon: 'modules/core/img/map_icons/number_2.png',
				model_name: 'number_2'
			},
			marker_3: {
				icon: 'modules/core/img/map_icons/number_3.png',
				model_name: 'number_3'
			},
			marker_4: {
				icon: 'modules/core/img/map_icons/number_4.png',
				model_name: 'number_4'
			},
			marker_5: {
				icon: 'modules/core/img/map_icons/number_5.png',
				model_name: 'number_5'
			}
		};

		$scope.frequentVisit = {
			frequent_marker_1: {
				icon: 'modules/core/img/map_icons/number_1_purple.png',
				model_name: 'number_1_purple'
			},
			frequent_marker_2: {
				icon: 'modules/core/img/map_icons/number_2_purple.png',
				model_name: 'number_2_purple'
			},
			frequent_marker_3: {
				icon: 'modules/core/img/map_icons/number_3_purple.png',
				model_name: 'number_3_purple'
			}
		}

		$scope.markers = new Array();

		$scope.message = 'Put the addresses of the places you want to evaluate.';
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

		$scope.events = {
			markers: {
				enable: leafletEvents.getAvailableMarkerEvents(),
			}
		};

		$scope.geocode = function(name, textval){
			Places.getGeocode(textval)
				.then(
					function( payload ) {
						//console.log(payload.data.Response.View[0].Result[0].Location);
						$scope.markers.push({
							lat: payload.data.Response.View[0].Result[0].Location.NavigationPosition[0].Latitude,
							lng: payload.data.Response.View[0].Result[0].Location.NavigationPosition[0].Longitude,
							message: 'My Added Marker',
							icon: {
								iconUrl: 'modules/core/img/map_icons/'+ name +'.png',
								iconAnchor: [14,37]
							}
						});
					}

				)
		};

	}
]);
