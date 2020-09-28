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
}

module.exports = QuestionsController;