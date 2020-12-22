const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();
const ConditionModel = use('App/Models/Condition');
const QuestionModel = use('App/Models/Question');

const { transform } = use('App/Helpers/Transformer');
const { check } = use('App/Helpers/Conditions');

class Question {

	async handle(session, response)
	{
		let current = await session.question ().with ('conditions').first ();
		
		if(!current) {
			return null;
		}
		
		let condition = await this.condition(current, response);
		
		return await this.next (session, current, condition);
	}
	
	async condition(current, response)
	{
		let count = await current.conditions().getCount();
		
		console.log(count, 'condition count');
		
		let conditions = await current.conditions().fetch();
		
		conditions = count > 0 ? conditions.toJSON() : [];
		
		console.log(conditions, 'these are the conditions');
		
		let appliedCondition = null;
		
		for (let i = 0; i < conditions.length; i++) {
			
			let condition = await ConditionModel.find(conditions[i].id);
			
			let resp = await check(condition, response.response);
			
			if(resp) {
				appliedCondition = condition;
				break;
			}
		}
		
		console.log(appliedCondition, 'applied condition');
		
		return appliedCondition;
	}
	
	async next(session, current, condition)
	{
		let instance = await session.instance().first();
		
		let survey = await instance.survey().first();
		
		let question = null;
		
		console.log(condition, 'this is the condition');
		
		if(condition && condition.end) {
			return null;
		}
		
		if(condition && condition.next_question_id) {
			question = await QuestionModel.find(condition.next_question_id);
		} else {
			question = await QuestionRepo.nextQuestion(survey, current.rank);
		}
		
		if(!question) {
			return question;
		}
		
		return await transform(question, 'Question');
	}
}

module.exports = Question;
