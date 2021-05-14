'use strict';

const Dispatch = new(use('App/Services/Survey/Dispatch'))();

const Instance = exports = module.exports = {}

Instance.ready = async (instance) => {
	console.log('INSTANCE READY: at the instance level');
	return await Dispatch.handle(instance);
}

Instance.dispatch = async (instance) => {
	console.log('DISPATCH INSTANCE');
}
