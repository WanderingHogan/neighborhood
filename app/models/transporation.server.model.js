'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Transporation Schema
 */
var TransporationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Transporation name',
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

mongoose.model('Transporation', TransporationSchema);