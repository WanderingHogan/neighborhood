'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Environment = mongoose.model('Environment'),
	_ = require('lodash');

/**
 * Create a Environment
 */
exports.create = function(req, res) {
	var environment = new Environment(req.body);
	environment.user = req.user;

	environment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(environment);
		}
	});
};

/**
 * Show the current Environment
 */
exports.read = function(req, res) {
	res.jsonp(req.environment);
};

/**
 * Update a Environment
 */
exports.update = function(req, res) {
	var environment = req.environment ;

	environment = _.extend(environment , req.body);

	environment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(environment);
		}
	});
};

/**
 * Delete an Environment
 */
exports.delete = function(req, res) {
	var environment = req.environment ;

	environment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(environment);
		}
	});
};

/**
 * List of Environments
 */
exports.list = function(req, res) { Environment.find().sort('-created').populate('user', 'displayName').exec(function(err, environments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(environments);
		}
	});
};

/**
 * Environment middleware
 */
exports.environmentByID = function(req, res, next, id) { Environment.findById(id).populate('user', 'displayName').exec(function(err, environment) {
		if (err) return next(err);
		if (! environment) return next(new Error('Failed to load Environment ' + id));
		req.environment = environment ;
		next();
	});
};

/**
 * Environment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.environment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};