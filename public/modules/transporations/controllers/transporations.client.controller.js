'use strict';

// Transporations controller
angular.module('transporations').controller('TransporationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Transporations',
	function($scope, $stateParams, $location, Authentication, Transporations ) {
		$scope.authentication = Authentication;

		// Create new Transporation
		$scope.create = function() {
			// Create new Transporation object
			var transporation = new Transporations ({
				name: this.name
			});

			// Redirect after save
			transporation.$save(function(response) {
				$location.path('transporations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Transporation
		$scope.remove = function( transporation ) {
			if ( transporation ) { transporation.$remove();

				for (var i in $scope.transporations ) {
					if ($scope.transporations [i] === transporation ) {
						$scope.transporations.splice(i, 1);
					}
				}
			} else {
				$scope.transporation.$remove(function() {
					$location.path('transporations');
				});
			}
		};

		// Update existing Transporation
		$scope.update = function() {
			var transporation = $scope.transporation ;

			transporation.$update(function() {
				$location.path('transporations/' + transporation._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Transporations
		$scope.find = function() {
			$scope.transporations = Transporations.query();
		};

		// Find existing Transporation
		$scope.findOne = function() {
			$scope.transporation = Transporations.get({ 
				transporationId: $stateParams.transporationId
			});
		};
	}
]);