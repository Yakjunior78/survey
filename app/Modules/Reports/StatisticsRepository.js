const InstanceModel = use('App/Models/Instance');
const QuestionModel = use('App/Models/Question');

const { transform } = use('App/Helpers/Transformer');

class StatisticsRepository {
	async instanceQuestions(id)
	{
		let instance = await InstanceModel.query().where('uuid', id).first();
		
		let questions = await instance.questions().fetch();
		
		questions = questions.toJSON();
		
		let transformedQuestions = [];
		
		for (let i = 0; i < questions.length; i++) {
			
			let question = await QuestionModel.find(questions[i].id);
			
			let transformedQuestion =  await transform(question, 'QuestionStatistics');
			
			await transformedQuestions.push(transformedQuestion);
		}
		
		return transformedQuestions;
	}
}

module.exports = StatisticsRepository;