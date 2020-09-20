'use strict'

const uuidv4 = require('uuid/v4');

const UuidHook = exports = module.exports = {}

UuidHook.generateUuid = async module => {
	module.uuid = uuidv4();
}
