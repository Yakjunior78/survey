const ConditionRepo = new(use('App/Modules/Questions/ConditionRepository'))();

class ConditionsController {
	async store({ request, response })
	{
		let data = request.all();
		
		let result = await ConditionRepo.store(data);
		
		return response.json(result);
	}
}

module.exports = ConditionsController;