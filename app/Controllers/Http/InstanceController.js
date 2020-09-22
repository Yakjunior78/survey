'use strict';

const InstanceRepository = new(use('App/Modules/Instances/InstanceRepository'))();

class InstanceController {
	async show({ request, params, response }) {
		return response.json(params);
	}
}

module.exports = InstanceController
