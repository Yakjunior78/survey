const QuestionModel = use('App/Models/Question');
const SurveyModel = use('App/Models/Survey');
const ConditionModel = use('App/Models/Condition');
const { transform } = use('App/Helpers/Transformer');

class QuestionRepository {
	
	async store(data)
	{
		let survey = await SurveyModel.find(data.survey_id);
		
		let count = await survey.questions().getCount();
		
		data.rank = count + 1;
		
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
		
		let question = await QuestionModel.find(id);
		
		return {
			status: 201,
			message: 'Question updated successfully!',
			question:  await transform(question, 'Question')
		}
	}
	
	async destroy(id)
	{
		let question = await QuestionModel.findOrFail(id);
		
		await question.conditions().delete();
		
		await question.choices().delete();
		
		await question.responses().delete();
		
		await question.delete();
		
		return {
			status: 201,
			message: 'Question deleted successfully',
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
	
	async updateRank(data)
	{
		for (let i = 0; i < data.length; i++) {
			let question = await QuestionModel.findOrFail(data[i].id);
			question.update({ rank: data[i].rank });
		}
		
		return {
			status: 201,
			message: 'Questions rank updated successfully'
		};
	}
}
module.exports = QuestionRepository;