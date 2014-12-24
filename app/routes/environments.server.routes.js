'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var environments = require('../../app/controllers/environments');

	// Environments Routes
	app.route('/environments')
		.get(environments.list)
		.post(users.requiresLogin, environments.create);

	app.route('/environments/:environmentId')
		.get(environments.read)
		.put(users.requiresLogin, environments.hasAuthorization, environments.update)
		.delete(users.requiresLogin, environments.hasAuthorization, environments.delete);

	// Finish by binding the Environment middleware
	app.param('environmentId', environments.environmentByID);
};