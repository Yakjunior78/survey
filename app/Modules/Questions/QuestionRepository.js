const QuestionModel = use('App/Models/Question');
const { transform } = use('App/Helpers/Transformer');

class QuestionRepository {
	
	async store(data)
	{
		let question = await QuestionModel.create (data);
		return {
			status: 201,
			message: 'Question created successfully',
			question:  await transform(question, 'Question')
		};
	}
	
	async update(id, data)
	{
		await QuestionModel
			.query()
			.where('id', id)
			.update(data);
		
		return {
			status: 201,
			message: 'Question updated successfully!'
		}
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