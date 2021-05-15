'use strict';

const InstanceRepository = new(use('App/Modules/Instances/InstanceRepository'))();
const InstanceHandler = new(use('App/Modules/Instances/InstanceHandler'))();
const Initialize = new(use('App/Services/Survey/Initialize'))();

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
		let result = await Initialize.handle(request.all());

		return response.json(result);
	}

	async dispatch({ params, response })
	{
		let result = await InstanceHandler.ready (params.id);

		return response.json (result);
	}
}

module.exports = InstanceController
