const repo = new(use('App/Modules/Reports/StatisticsRepository'))();

class StatisticsController {
	
	async questions({ request, response })
	{
		let data = request.all();
		
		let result = await repo.instanceQuestions(data.survey_id, data.instance_id);
		
		return response.json(result);
	}
	
	async summary({ request, response })
	{
		let data = request.all();
		
		let result = await StatRepo.instanceQuestions(data.survey_id, data.instance_id);
		
		return response.json(result);
	}
}

module.exports = StatisticsController;