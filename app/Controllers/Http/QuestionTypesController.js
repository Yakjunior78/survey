const QuestionTypeRepo = new(use('App/Modules/Questions/QuestionTypeRepository'))();

class QuestionTypesController {
	
	async all({ response })
	{
		return response.json(await QuestionTypeRepo.get());
	}
}

module.exports = QuestionTypesController;