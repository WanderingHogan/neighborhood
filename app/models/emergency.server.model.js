'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Emergency Schema
 */
var EmergencySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Emergency name',
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

mongoose.model('Emergency', EmergencySchema);