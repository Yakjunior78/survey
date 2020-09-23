'use strict';

const InstanceRepository = new(use('App/Modules/Instances/InstanceRepository'))();

class InstanceController {
	
	async show({ request, params, response }) {
		return response.json(params);
	}
	
	async initialize({ request, response })
	{
		let data = request.all();
		
		let result = await InstanceRepository.initialize(request.all());
		
		return response.json(result);
	}
}

module.exports = InstanceController
