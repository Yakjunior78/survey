const QuestionModel = use('App/Models/Question');
const ChoiceModel = use('App/Models/Choice');

class RatingRepository {
	
	async store(data)
	{
		let question = await QuestionModel.query().where('uuid', data.question_id).first();
		
		let choices = await question.choices().delete();
		
		for (let i = 1; i < data.max + 1; i++) {
			await ChoiceModel.create({
				name: i,
				label: i,
				value: i,
				question_id: question.id,
				rank: i
			});
		}
		
		return {
			status: 201,
			message: 'Question rating saved successfully',
			question: question
		}
	}
}

module.exports = RatingRepository;