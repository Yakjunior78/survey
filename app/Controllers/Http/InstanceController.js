'use strict';

const InstanceRepository = new(use('App/Modules/Instances/InstanceRepository'))();
const InstanceHandler = new(use('App/Modules/Instances/InstanceHandler'))();

class InstanceController {
	
	async store({ request, response })
	{
		let result = await InstanceRepository.store(request.all());
		
		return response.json(result);
	}
	
	async update({ request, params, response })
	{
		let result = await InstanceRepository.update(params.id, request.all());
		
		return response.json(result);
	}
	
	async destroy({ params, response })
	{
		let result = await InstanceRepository.destroy(params.id);
		
		return response.json(result);
	}
	
	async initialize({ request, response })
	{
		let data = request.all();
		
		let result = await InstanceRepository.initialize(request.all());
		
		return response.json(result);
	}
	
	async dispatch({ params, response })
	{
		let result = await InstanceHandler.handle(params.id);
		
		return response.json(result);
	}
}

module.exports = InstanceController
