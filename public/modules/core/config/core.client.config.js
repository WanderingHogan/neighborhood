'use strict';

// Configuring the Articles module
angular.module('places').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Places', 'places', '/places');
		Menus.addMenuItem('topbar', 'People', 'people', '/people(/create)?');
		Menus.addMenuItem('topbar', 'Environment', 'environments', '/environments(/create)?');
		Menus.addMenuItem('topbar', 'Emergency', 'emergencies', '/emergencies(/create)?');
		Menus.addMenuItem('topbar', 'Transporation', 'transporations', '/transporations(/create)?');
	}
]);
