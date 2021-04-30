'use strict'

const cuid = require('cuid');

const UuidHook = exports = module.exports = {}

UuidHook.generateUuid = async module => {
	module.uuid = cuid();
}

UuidHook.generateShorterUuid = async module => {
	module.uuid = cuid();
}
