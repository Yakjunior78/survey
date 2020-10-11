const ConditionRepo = new(use('App/Modules/Questions/ConditionRepository'))();

class ConditionsController {
	async store({ request, response })
	{
		let data = request.all();
		
		let result = await ConditionRepo.store(data);
		
		return response.json(result);
	}
	
	async destroy({ params, response })
	{
		let result = await ConditionRepo.destroy(params.id);
		
		return response.json(result);
	}
}

module.exports = ConditionsController;