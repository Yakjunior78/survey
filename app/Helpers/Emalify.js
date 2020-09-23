'use strict';

const uuidv4 = require('uuid/v4');
const cuid = require('cuid');
const StatusModel = use('App/Models/Status');

const random = async () => {
	return Math.random().toString(36).substr(5);
}

const token = async () => {
	return uuidv4(6);
}

const shortToken = async () => {
	return cuid();
}

const getStatus = async (slug) => {
	return StatusModel
		.query ()
		.where ('slug', slug)
		.first ();
}

module.exports = {
	random,
	token,
	getStatus,
	shortToken
}
