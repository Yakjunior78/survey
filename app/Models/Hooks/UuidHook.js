'use strict'

const uuidv4 = require('uuid/v4');
const cuid = require('cuid');

const UuidHook = exports = module.exports = {}

UuidHook.generateUuid = async module => {
	module.uuid = uuidv4();
}

UuidHook.generateShorterUuid = async module => {
	module.uuid = cuid();
}
