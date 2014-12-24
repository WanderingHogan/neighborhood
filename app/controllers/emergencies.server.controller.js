'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Emergency = mongoose.model('Emergency'),
	_ = require('lodash');

/**
 * Create a Emergency
 */
exports.create = function(req, res) {
	var emergency = new Emergency(req.body);
	emergency.user = req.user;

	emergency.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emergency);
		}
	});
};

/**
 * Show the current Emergency
 */
exports.read = function(req, res) {
	res.jsonp(req.emergency);
};

/**
 * Update a Emergency
 */
exports.update = function(req, res) {
	var emergency = req.emergency ;

	emergency = _.extend(emergency , req.body);

	emergency.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emergency);
		}
	});
};

/**
 * Delete an Emergency
 */
exports.delete = function(req, res) {
	var emergency = req.emergency ;

	emergency.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emergency);
		}
	});
};

/**
 * List of Emergencies
 */
exports.list = function(req, res) { Emergency.find().sort('-created').populate('user', 'displayName').exec(function(err, emergencies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(emergencies);
		}
	});
};

/**
 * Emergency middleware
 */
exports.emergencyByID = function(req, res, next, id) { Emergency.findById(id).populate('user', 'displayName').exec(function(err, emergency) {
		if (err) return next(err);
		if (! emergency) return next(new Error('Failed to load Emergency ' + id));
		req.emergency = emergency ;
		next();
	});
};

/**
 * Emergency authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.emergency.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};