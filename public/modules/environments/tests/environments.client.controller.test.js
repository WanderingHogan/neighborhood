'use strict';

(function() {
	// Environments Controller Spec
	describe('Environments Controller Tests', function() {
		// Initialize global variables
		var EnvironmentsController,
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

			// Initialize the Environments controller.
			EnvironmentsController = $controller('EnvironmentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Environment object fetched from XHR', inject(function(Environments) {
			// Create sample Environment using the Environments service
			var sampleEnvironment = new Environments({
				name: 'New Environment'
			});

			// Create a sample Environments array that includes the new Environment
			var sampleEnvironments = [sampleEnvironment];

			// Set GET response
			$httpBackend.expectGET('environments').respond(sampleEnvironments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.environments).toEqualData(sampleEnvironments);
		}));

		it('$scope.findOne() should create an array with one Environment object fetched from XHR using a environmentId URL parameter', inject(function(Environments) {
			// Define a sample Environment object
			var sampleEnvironment = new Environments({
				name: 'New Environment'
			});

			// Set the URL parameter
			$stateParams.environmentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/environments\/([0-9a-fA-F]{24})$/).respond(sampleEnvironment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.environment).toEqualData(sampleEnvironment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Environments) {
			// Create a sample Environment object
			var sampleEnvironmentPostData = new Environments({
				name: 'New Environment'
			});

			// Create a sample Environment response
			var sampleEnvironmentResponse = new Environments({
				_id: '525cf20451979dea2c000001',
				name: 'New Environment'
			});

			// Fixture mock form input values
			scope.name = 'New Environment';

			// Set POST response
			$httpBackend.expectPOST('environments', sampleEnvironmentPostData).respond(sampleEnvironmentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Environment was created
			expect($location.path()).toBe('/environments/' + sampleEnvironmentResponse._id);
		}));

		it('$scope.update() should update a valid Environment', inject(function(Environments) {
			// Define a sample Environment put data
			var sampleEnvironmentPutData = new Environments({
				_id: '525cf20451979dea2c000001',
				name: 'New Environment'
			});

			// Mock Environment in scope
			scope.environment = sampleEnvironmentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/environments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/environments/' + sampleEnvironmentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid environmentId and remove the Environment from the scope', inject(function(Environments) {
			// Create new Environment object
			var sampleEnvironment = new Environments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Environments array and include the Environment
			scope.environments = [sampleEnvironment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/environments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEnvironment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.environments.length).toBe(0);
		}));
	});
}());