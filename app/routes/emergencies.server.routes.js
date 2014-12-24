'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var emergencies = require('../../app/controllers/emergencies');

	// Emergencies Routes
	app.route('/emergencies')
		.get(emergencies.list)
		.post(users.requiresLogin, emergencies.create);

	app.route('/emergencies/:emergencyId')
		.get(emergencies.read)
		.put(users.requiresLogin, emergencies.hasAuthorization, emergencies.update)
		.delete(users.requiresLogin, emergencies.hasAuthorization, emergencies.delete);

	// Finish by binding the Emergency middleware
	app.param('emergencyId', emergencies.emergencyByID);
};