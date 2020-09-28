const QuestionModel = use('App/Models/Question');

class QuestionRepository {
	
	async store(data)
	{
		return QuestionModel.create (data);
	}
	
	async update(id, data)
	{
		return await QuestionModel
			.query()
			.where('id', id)
			.update(data);
	}
	
	async questionData(data)
	{
		return data;
	}
	
	async get(survey, rank)
	{
		return survey
			.questions ()
			.where ('rank', rank)
			.first ();
	}
	
	async nextQuestion(survey, rank)
	{
		return survey
			.questions ()
			.where ('rank', rank + 1)
			.first ();
	}
}
module.exports = QuestionRepository;