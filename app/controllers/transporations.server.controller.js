'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Transporation = mongoose.model('Transporation'),
	_ = require('lodash');

/**
 * Create a Transporation
 */
exports.create = function(req, res) {
	var transporation = new Transporation(req.body);
	transporation.user = req.user;

	transporation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transporation);
		}
	});
};

/**
 * Show the current Transporation
 */
exports.read = function(req, res) {
	res.jsonp(req.transporation);
};

/**
 * Update a Transporation
 */
exports.update = function(req, res) {
	var transporation = req.transporation ;

	transporation = _.extend(transporation , req.body);

	transporation.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transporation);
		}
	});
};

/**
 * Delete an Transporation
 */
exports.delete = function(req, res) {
	var transporation = req.transporation ;

	transporation.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transporation);
		}
	});
};

/**
 * List of Transporations
 */
exports.list = function(req, res) { Transporation.find().sort('-created').populate('user', 'displayName').exec(function(err, transporations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(transporations);
		}
	});
};

/**
 * Transporation middleware
 */
exports.transporationByID = function(req, res, next, id) { Transporation.findById(id).populate('user', 'displayName').exec(function(err, transporation) {
		if (err) return next(err);
		if (! transporation) return next(new Error('Failed to load Transporation ' + id));
		req.transporation = transporation ;
		next();
	});
};

/**
 * Transporation authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.transporation.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};