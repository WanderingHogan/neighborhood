'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Environment Schema
 */
var EnvironmentSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Environment name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Environment', EnvironmentSchema);