'use strict';

// Environments controller
angular.module('environments').controller('EnvironmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Environments',
	function($scope, $stateParams, $location, Authentication, Environments ) {
		$scope.authentication = Authentication;

		// Create new Environment
		$scope.create = function() {
			// Create new Environment object
			var environment = new Environments ({
				name: this.name
			});

			// Redirect after save
			environment.$save(function(response) {
				$location.path('environments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Environment
		$scope.remove = function( environment ) {
			if ( environment ) { environment.$remove();

				for (var i in $scope.environments ) {
					if ($scope.environments [i] === environment ) {
						$scope.environments.splice(i, 1);
					}
				}
			} else {
				$scope.environment.$remove(function() {
					$location.path('environments');
				});
			}
		};

		// Update existing Environment
		$scope.update = function() {
			var environment = $scope.environment ;

			environment.$update(function() {
				$location.path('environments/' + environment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Environments
		$scope.find = function() {
			$scope.environments = Environments.query();
		};

		// Find existing Environment
		$scope.findOne = function() {
			$scope.environment = Environments.get({ 
				environmentId: $stateParams.environmentId
			});
		};
	}
]);