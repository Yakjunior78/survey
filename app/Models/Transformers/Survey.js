const { transform } = use('App/Helpers/Transformer');
const QuestionModel = use('App/Models/Question');

class SurveyTransformer {
	
	async transform(survey) {
		
		let company = await survey.company().first();
		let category = await survey.category().first();
		let status = await survey.status().first();
		
		return {
			uuid: survey.uuid,
			title: survey.title,
			description: survey.description,
			company: company ? company.name : null,
			category_id: survey.category_id,
			category: category ? category.name : null,
			status_id: survey.status_id,
			status: status ? status.name : null,
			by: survey.created_by,
			questions: await this.questions(survey)
		}
	}
	
	async questions(survey)
	{
		let questions =  await survey.questions().fetch();
		
		questions = questions.toJSON();
		
		let transformedQuestions = [];
		
		for (let i = 0; i < questions.length; i++) {
			
			let question = await QuestionModel.findOrFail(questions[i].id);
			
			let transformed = await transform (question, 'Question');
			transformedQuestions.push(transformed);
		}
		
		return transformedQuestions;
	}
}

module.exports = SurveyTransformer;