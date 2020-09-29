const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();

class QuestionsController {
	
	async store({ request, response })
	{
		let data = request.all();
		return response.json(await QuestionRepo.store(data));
	}
	
	async update({ request, params, response })
	{
		let id = params.id;
		
		let data = request.all();
		
		return response.json(await QuestionRepo.update(id, data));
	}
	
	async destroy({ params, response })
	{
		return response.json(await QuestionRepo.destroy(params.id));
	}
	
	async updateRank({ request, response })
	{
		let data = request.all();
		
		let result = await QuestionRepo.updateRank(data.questions);
		
		return response.json(result);
	}
}

module.exports = QuestionsController;