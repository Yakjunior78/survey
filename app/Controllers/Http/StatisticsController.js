const StatRepo = new(use('App/Modules/Reports/StatisticsRepository'))();

class StatisticsController {
	async instance({ request, response })
	{
		let data = request.all();
		
		let result = await StatRepo.instanceQuestions(data.uuid);
		
		return response.json(result);
	}
}

module.exports = StatisticsController;