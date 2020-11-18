const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();
const ConditionModel = use('App/Models/Condition');
const QuestionModel = use('App/Models/Question');

const { transform } = use('App/Helpers/Transformer');
const { check } = use('App/Helpers/Conditions');

class Question {

	async handle(session, response)
	{
		let current = await this.current(session);
		
		let condition = await this.condition(current, response);
		
		let next = await this.next(session, current, condition);
		
		await this.updateSession(session, next);
		
		return next;
	}
	
	async current(session)
	{
		let sessionTrail = await session.sessionTrails().first();
		
		return sessionTrail.question ().with ('conditions').first ();
	}
	
	async condition(current, response)
	{
		let count = await current.conditions().getCount();
		
		let conditions = await current.conditions().fetch();
		
		conditions = count ? conditions.toJSON() : [];
		
		let appliedCondition = null;
		
		for (let i = 0; i < conditions.length; i++) {
			
			let condition = await ConditionModel.find(conditions[i].id);
			
			let resp = await check(condition, response.response);
			
			if(resp) {
				appliedCondition = condition;
				break;
			}
		}
		
		return appliedCondition;
	}
	
	async next(session, current, condition)
	{
		let instance = await session.instance().first();
		
		let survey = await instance.survey().first();
		
		let question = null;
		
		if(condition && condition.end) {
			return null;
		}
		
		if(condition && condition.next_question_id) {
			question = await QuestionModel.find(condition.next_question_id);
		} else {
			question = await QuestionRepo.nextQuestion(survey, current.rank);
		}
		
		return await transform(question, 'Question');
	}
	
	async updateSession(session, question)
	{
		await session.save();

		return session;
	}
}

module.exports = Question;
