'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('emergencies');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('environments');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('people');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('places');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('transporations');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('places').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Places', 'places', '/places(/create)?');
    Menus.addMenuItem('topbar', 'People', 'people', '/people(/create)?');
    Menus.addMenuItem('topbar', 'Environment', 'environments', '/environments(/create)?');
    Menus.addMenuItem('topbar', 'Emergency', 'emergencies', '/emergencies(/create)?');
    Menus.addMenuItem('topbar', 'Transporation', 'transporations', '/transporations(/create)?');
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    angular.extend($scope, {
      center: {
        lat: 40.095,
        lng: -3.823,
        zoom: 4
      },
      defaults: { scrollWheelZoom: false }
    });
  }
]);// 'use strict';
//
// angular.module('core').directive('map', [
// 	function() {
// 		return {
// 			template: '<div></div>',
// 			restrict: 'E',
// 			link: function postLink(scope, element, attrs) {
// 				angular.extend($scope, {
// 				    defaults: {
// 				        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
// 				        maxZoom: 14,
// 				        path: {
// 				            weight: 10,
// 				            color: '#800000',
// 				            opacity: 1
// 				        }
// 				    }
// 				});
// 				angular.extend($scope, {
// 				    center: {
// 				        lat: 51.505,
// 				        lng: -0.09,
// 				        zoom: 8
// 				    }
// 				});
// 			}
// 		};
// 	}
// ]);
'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);// 'use strict';
// // Configuring the Articles module
// angular.module('emergencies').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Emergencies', 'emergencies', '/emergencies(/create)?');
// 	}
// ]);
'use strict';
//Setting up route
angular.module('emergencies').config([
  '$stateProvider',
  function ($stateProvider) {
    // Emergencies state routing
    $stateProvider.state('listEmergencies', {
      url: '/emergencies',
      templateUrl: 'modules/emergencies/views/list-emergencies.client.view.html'
    }).state('createEmergency', {
      url: '/emergencies/create',
      templateUrl: 'modules/emergencies/views/create-emergency.client.view.html'
    }).state('viewEmergency', {
      url: '/emergencies/:emergencyId',
      templateUrl: 'modules/emergencies/views/view-emergency.client.view.html'
    }).state('editEmergency', {
      url: '/emergencies/:emergencyId/edit',
      templateUrl: 'modules/emergencies/views/edit-emergency.client.view.html'
    });
  }
]);'use strict';
// Emergencies controller
angular.module('emergencies').controller('EmergenciesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Emergencies',
  function ($scope, $stateParams, $location, Authentication, Emergencies) {
    $scope.authentication = Authentication;
    // Create new Emergency
    $scope.create = function () {
      // Create new Emergency object
      var emergency = new Emergencies({ name: this.name });
      // Redirect after save
      emergency.$save(function (response) {
        $location.path('emergencies/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Emergency
    $scope.remove = function (emergency) {
      if (emergency) {
        emergency.$remove();
        for (var i in $scope.emergencies) {
          if ($scope.emergencies[i] === emergency) {
            $scope.emergencies.splice(i, 1);
          }
        }
      } else {
        $scope.emergency.$remove(function () {
          $location.path('emergencies');
        });
      }
    };
    // Update existing Emergency
    $scope.update = function () {
      var emergency = $scope.emergency;
      emergency.$update(function () {
        $location.path('emergencies/' + emergency._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Emergencies
    $scope.find = function () {
      $scope.emergencies = Emergencies.query();
    };
    // Find existing Emergency
    $scope.findOne = function () {
      $scope.emergency = Emergencies.get({ emergencyId: $stateParams.emergencyId });
    };
  }
]);'use strict';
//Emergencies service used to communicate Emergencies REST endpoints
angular.module('emergencies').factory('Emergencies', [
  '$resource',
  function ($resource) {
    return $resource('emergencies/:emergencyId', { emergencyId: '@_id' }, { update: { method: 'PUT' } });
  }
]);// 'use strict';
// // Configuring the Articles module
// angular.module('environments').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Environment', 'environments', '/environments(/create)?');
// 	}
// ]);
'use strict';
//Setting up route
angular.module('environments').config([
  '$stateProvider',
  function ($stateProvider) {
    // Environments state routing
    $stateProvider.state('listEnvironments', {
      url: '/environments',
      templateUrl: 'modules/environments/views/list-environments.client.view.html'
    }).state('createEnvironment', {
      url: '/environments/create',
      templateUrl: 'modules/environments/views/create-environment.client.view.html'
    }).state('viewEnvironment', {
      url: '/environments/:environmentId',
      templateUrl: 'modules/environments/views/view-environment.client.view.html'
    }).state('editEnvironment', {
      url: '/environments/:environmentId/edit',
      templateUrl: 'modules/environments/views/edit-environment.client.view.html'
    });
  }
]);'use strict';
// Environments controller
angular.module('environments').controller('EnvironmentsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Environments',
  function ($scope, $stateParams, $location, Authentication, Environments) {
    $scope.authentication = Authentication;
    // Create new Environment
    $scope.create = function () {
      // Create new Environment object
      var environment = new Environments({ name: this.name });
      // Redirect after save
      environment.$save(function (response) {
        $location.path('environments/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Environment
    $scope.remove = function (environment) {
      if (environment) {
        environment.$remove();
        for (var i in $scope.environments) {
          if ($scope.environments[i] === environment) {
            $scope.environments.splice(i, 1);
          }
        }
      } else {
        $scope.environment.$remove(function () {
          $location.path('environments');
        });
      }
    };
    // Update existing Environment
    $scope.update = function () {
      var environment = $scope.environment;
      environment.$update(function () {
        $location.path('environments/' + environment._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Environments
    $scope.find = function () {
      $scope.environments = Environments.query();
    };
    // Find existing Environment
    $scope.findOne = function () {
      $scope.environment = Environments.get({ environmentId: $stateParams.environmentId });
    };
  }
]);'use strict';
//Environments service used to communicate Environments REST endpoints
angular.module('environments').factory('Environments', [
  '$resource',
  function ($resource) {
    return $resource('environments/:environmentId', { environmentId: '@_id' }, { update: { method: 'PUT' } });
  }
]);// 'use strict';
// // Configuring the Articles module
// angular.module('people').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'People', 'people', '/people(/create)?');
// 	}
// ]);
'use strict';
//Setting up route
angular.module('people').config([
  '$stateProvider',
  function ($stateProvider) {
    // People state routing
    $stateProvider.state('listPeople', {
      url: '/people',
      templateUrl: 'modules/people/views/list-people.client.view.html'
    }).state('createPerson', {
      url: '/people/create',
      templateUrl: 'modules/people/views/create-person.client.view.html'
    }).state('viewPerson', {
      url: '/people/:personId',
      templateUrl: 'modules/people/views/view-person.client.view.html'
    }).state('editPerson', {
      url: '/people/:personId/edit',
      templateUrl: 'modules/people/views/edit-person.client.view.html'
    });
  }
]);'use strict';
// People controller
angular.module('people').controller('PeopleController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'People',
  function ($scope, $stateParams, $location, Authentication, People) {
    $scope.authentication = Authentication;
    // Create new Person
    $scope.create = function () {
      // Create new Person object
      var person = new People({ name: this.name });
      // Redirect after save
      person.$save(function (response) {
        $location.path('people/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Person
    $scope.remove = function (person) {
      if (person) {
        person.$remove();
        for (var i in $scope.people) {
          if ($scope.people[i] === person) {
            $scope.people.splice(i, 1);
          }
        }
      } else {
        $scope.person.$remove(function () {
          $location.path('people');
        });
      }
    };
    // Update existing Person
    $scope.update = function () {
      var person = $scope.person;
      person.$update(function () {
        $location.path('people/' + person._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of People
    $scope.find = function () {
      $scope.people = People.query();
    };
    // Find existing Person
    $scope.findOne = function () {
      $scope.person = People.get({ personId: $stateParams.personId });
    };
  }
]);'use strict';
//People service used to communicate People REST endpoints
angular.module('people').factory('People', [
  '$resource',
  function ($resource) {
    return $resource('people/:personId', { personId: '@_id' }, { update: { method: 'PUT' } });
  }
]);// 'use strict';
// // Configuring the Articles module
// angular.module('places').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Places', 'places', '/places(/create)?');
// 	}
// ]);
'use strict';
//Setting up route
angular.module('places').config([
  '$stateProvider',
  function ($stateProvider) {
    // Places state routing
    $stateProvider.state('listPlaces', {
      url: '/places',
      templateUrl: 'modules/places/views/list-places.client.view.html'
    }).state('createPlace', {
      url: '/places/create',
      templateUrl: 'modules/places/views/create-place.client.view.html'
    }).state('viewPlace', {
      url: '/places/:placeId',
      templateUrl: 'modules/places/views/view-place.client.view.html'
    }).state('editPlace', {
      url: '/places/:placeId/edit',
      templateUrl: 'modules/places/views/edit-place.client.view.html'
    });
  }
]);'use strict';
// Places controller
angular.module('places').controller('PlacesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Places',
  function ($scope, $stateParams, $location, Authentication, Places) {
    $scope.authentication = Authentication;
    // Create new Place
    $scope.create = function () {
      // Create new Place object
      var place = new Places({ name: this.name });
      // Redirect after save
      place.$save(function (response) {
        $location.path('places/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Place
    $scope.remove = function (place) {
      if (place) {
        place.$remove();
        for (var i in $scope.places) {
          if ($scope.places[i] === place) {
            $scope.places.splice(i, 1);
          }
        }
      } else {
        $scope.place.$remove(function () {
          $location.path('places');
        });
      }
    };
    // Update existing Place
    $scope.update = function () {
      var place = $scope.place;
      place.$update(function () {
        $location.path('places/' + place._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Places
    $scope.find = function () {
      $scope.places = Places.query();
    };
    // Find existing Place
    $scope.findOne = function () {
      $scope.place = Places.get({ placeId: $stateParams.placeId });
    };
  }
]);'use strict';
//Places service used to communicate Places REST endpoints
angular.module('places').factory('Places', [
  '$resource',
  function ($resource) {
    return $resource('places/:placeId', { placeId: '@_id' }, { update: { method: 'PUT' } });
  }
]);// 'use strict';
// // Configuring the Articles module
// angular.module('transporations').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Transporations', 'transporations', '/transporations(/create)?');
// 	}
// ]);
'use strict';
//Setting up route
angular.module('transporations').config([
  '$stateProvider',
  function ($stateProvider) {
    // Transporations state routing
    $stateProvider.state('listTransporations', {
      url: '/transporations',
      templateUrl: 'modules/transporations/views/list-transporations.client.view.html'
    }).state('createTransporation', {
      url: '/transporations/create',
      templateUrl: 'modules/transporations/views/create-transporation.client.view.html'
    }).state('viewTransporation', {
      url: '/transporations/:transporationId',
      templateUrl: 'modules/transporations/views/view-transporation.client.view.html'
    }).state('editTransporation', {
      url: '/transporations/:transporationId/edit',
      templateUrl: 'modules/transporations/views/edit-transporation.client.view.html'
    });
  }
]);'use strict';
// Transporations controller
angular.module('transporations').controller('TransporationsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Transporations',
  function ($scope, $stateParams, $location, Authentication, Transporations) {
    $scope.authentication = Authentication;
    // Create new Transporation
    $scope.create = function () {
      // Create new Transporation object
      var transporation = new Transporations({ name: this.name });
      // Redirect after save
      transporation.$save(function (response) {
        $location.path('transporations/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Transporation
    $scope.remove = function (transporation) {
      if (transporation) {
        transporation.$remove();
        for (var i in $scope.transporations) {
          if ($scope.transporations[i] === transporation) {
            $scope.transporations.splice(i, 1);
          }
        }
      } else {
        $scope.transporation.$remove(function () {
          $location.path('transporations');
        });
      }
    };
    // Update existing Transporation
    $scope.update = function () {
      var transporation = $scope.transporation;
      transporation.$update(function () {
        $location.path('transporations/' + transporation._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Transporations
    $scope.find = function () {
      $scope.transporations = Transporations.query();
    };
    // Find existing Transporation
    $scope.findOne = function () {
      $scope.transporation = Transporations.get({ transporationId: $stateParams.transporationId });
    };
  }
]);'use strict';
//Transporations service used to communicate Transporations REST endpoints
angular.module('transporations').factory('Transporations', [
  '$resource',
  function ($resource) {
    return $resource('transporations/:transporationId', { transporationId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);