'use strict';

// Emergencies controller
angular.module('emergencies').controller('EmergenciesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Emergencies',
	function($scope, $stateParams, $location, Authentication, Emergencies ) {
		$scope.authentication = Authentication;

		// Create new Emergency
		$scope.create = function() {
			// Create new Emergency object
			var emergency = new Emergencies ({
				name: this.name
			});

			// Redirect after save
			emergency.$save(function(response) {
				$location.path('emergencies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Emergency
		$scope.remove = function( emergency ) {
			if ( emergency ) { emergency.$remove();

				for (var i in $scope.emergencies ) {
					if ($scope.emergencies [i] === emergency ) {
						$scope.emergencies.splice(i, 1);
					}
				}
			} else {
				$scope.emergency.$remove(function() {
					$location.path('emergencies');
				});
			}
		};

		// Update existing Emergency
		$scope.update = function() {
			var emergency = $scope.emergency ;

			emergency.$update(function() {
				$location.path('emergencies/' + emergency._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Emergencies
		$scope.find = function() {
			$scope.emergencies = Emergencies.query();
		};

		// Find existing Emergency
		$scope.findOne = function() {
			$scope.emergency = Emergencies.get({ 
				emergencyId: $stateParams.emergencyId
			});
		};
	}
]);