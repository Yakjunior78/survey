'use strict';

const InstanceRepository = new(use('App/Modules/Instances/InstanceRepository'))();

class InstanceController {
	
	async store({ request, response }) {
		
		let req = request.all();
		
		let result = await InstanceRepository.create(req);

		return response.json(result);
	}
}

module.exports = InstanceController
