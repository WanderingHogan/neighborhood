'use strict';

(function() {
	// Emergencies Controller Spec
	describe('Emergencies Controller Tests', function() {
		// Initialize global variables
		var EmergenciesController,
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

			// Initialize the Emergencies controller.
			EmergenciesController = $controller('EmergenciesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Emergency object fetched from XHR', inject(function(Emergencies) {
			// Create sample Emergency using the Emergencies service
			var sampleEmergency = new Emergencies({
				name: 'New Emergency'
			});

			// Create a sample Emergencies array that includes the new Emergency
			var sampleEmergencies = [sampleEmergency];

			// Set GET response
			$httpBackend.expectGET('emergencies').respond(sampleEmergencies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.emergencies).toEqualData(sampleEmergencies);
		}));

		it('$scope.findOne() should create an array with one Emergency object fetched from XHR using a emergencyId URL parameter', inject(function(Emergencies) {
			// Define a sample Emergency object
			var sampleEmergency = new Emergencies({
				name: 'New Emergency'
			});

			// Set the URL parameter
			$stateParams.emergencyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/emergencies\/([0-9a-fA-F]{24})$/).respond(sampleEmergency);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.emergency).toEqualData(sampleEmergency);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Emergencies) {
			// Create a sample Emergency object
			var sampleEmergencyPostData = new Emergencies({
				name: 'New Emergency'
			});

			// Create a sample Emergency response
			var sampleEmergencyResponse = new Emergencies({
				_id: '525cf20451979dea2c000001',
				name: 'New Emergency'
			});

			// Fixture mock form input values
			scope.name = 'New Emergency';

			// Set POST response
			$httpBackend.expectPOST('emergencies', sampleEmergencyPostData).respond(sampleEmergencyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Emergency was created
			expect($location.path()).toBe('/emergencies/' + sampleEmergencyResponse._id);
		}));

		it('$scope.update() should update a valid Emergency', inject(function(Emergencies) {
			// Define a sample Emergency put data
			var sampleEmergencyPutData = new Emergencies({
				_id: '525cf20451979dea2c000001',
				name: 'New Emergency'
			});

			// Mock Emergency in scope
			scope.emergency = sampleEmergencyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/emergencies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/emergencies/' + sampleEmergencyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid emergencyId and remove the Emergency from the scope', inject(function(Emergencies) {
			// Create new Emergency object
			var sampleEmergency = new Emergencies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Emergencies array and include the Emergency
			scope.emergencies = [sampleEmergency];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/emergencies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmergency);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.emergencies.length).toBe(0);
		}));
	});
}());