'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var transporations = require('../../app/controllers/transporations');

	// Transporations Routes
	app.route('/transporations')
		.get(transporations.list)
		.post(users.requiresLogin, transporations.create);

	app.route('/transporations/:transporationId')
		.get(transporations.read)
		.put(users.requiresLogin, transporations.hasAuthorization, transporations.update)
		.delete(users.requiresLogin, transporations.hasAuthorization, transporations.delete);

	// Finish by binding the Transporation middleware
	app.param('transporationId', transporations.transporationByID);
};