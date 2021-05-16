'use strict';

const cuid = require('cuid');
const StatusModel = use('App/Models/Status');

const random = async () => {
	return Math.random().toString(36).substr(5);
}

const token = async () => {
	return cuid();
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

const mapIds = async (arr, column) => {

	let ids = [];

	for (let i = 0; i < arr.length; i++) {
		if(arr[i][column]) {
			ids.push((parseInt(arr[i][column])));
		}
	}

	return ids;
}

const randId = async () => {
	return Math.floor(10000000000000000 + Math.random() * 90000000000000000);
}

module.exports = {
	random,
	token,
	getStatus,
	shortToken,
	mapIds,
	randId
}
