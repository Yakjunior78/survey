'use strict';

const Dispatch = new(use('App/Services/Survey/Dispatch'))();

const Instance = exports = module.exports = {}

Instance.ready = async (instance) => {
	return await Dispatch.handle(instance);
}
