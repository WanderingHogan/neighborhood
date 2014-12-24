'use strict';

(function() {
	// Transporations Controller Spec
	describe('Transporations Controller Tests', function() {
		// Initialize global variables
		var TransporationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Transporations controller.
			TransporationsController = $controller('TransporationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Transporation object fetched from XHR', inject(function(Transporations) {
			// Create sample Transporation using the Transporations service
			var sampleTransporation = new Transporations({
				name: 'New Transporation'
			});

			// Create a sample Transporations array that includes the new Transporation
			var sampleTransporations = [sampleTransporation];

			// Set GET response
			$httpBackend.expectGET('transporations').respond(sampleTransporations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.transporations).toEqualData(sampleTransporations);
		}));

		it('$scope.findOne() should create an array with one Transporation object fetched from XHR using a transporationId URL parameter', inject(function(Transporations) {
			// Define a sample Transporation object
			var sampleTransporation = new Transporations({
				name: 'New Transporation'
			});

			// Set the URL parameter
			$stateParams.transporationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/transporations\/([0-9a-fA-F]{24})$/).respond(sampleTransporation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.transporation).toEqualData(sampleTransporation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Transporations) {
			// Create a sample Transporation object
			var sampleTransporationPostData = new Transporations({
				name: 'New Transporation'
			});

			// Create a sample Transporation response
			var sampleTransporationResponse = new Transporations({
				_id: '525cf20451979dea2c000001',
				name: 'New Transporation'
			});

			// Fixture mock form input values
			scope.name = 'New Transporation';

			// Set POST response
			$httpBackend.expectPOST('transporations', sampleTransporationPostData).respond(sampleTransporationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Transporation was created
			expect($location.path()).toBe('/transporations/' + sampleTransporationResponse._id);
		}));

		it('$scope.update() should update a valid Transporation', inject(function(Transporations) {
			// Define a sample Transporation put data
			var sampleTransporationPutData = new Transporations({
				_id: '525cf20451979dea2c000001',
				name: 'New Transporation'
			});

			// Mock Transporation in scope
			scope.transporation = sampleTransporationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/transporations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/transporations/' + sampleTransporationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid transporationId and remove the Transporation from the scope', inject(function(Transporations) {
			// Create new Transporation object
			var sampleTransporation = new Transporations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Transporations array and include the Transporation
			scope.transporations = [sampleTransporation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/transporations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTransporation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.transporations.length).toBe(0);
		}));
	});
}());