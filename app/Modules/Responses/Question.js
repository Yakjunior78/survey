const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();
const ConditionModel = use('App/Models/Condition');
const QuestionModel = use('App/Models/Question');

const { transform } = use('App/Helpers/Transformer');
const { check } = use('App/Helpers/Conditions');

class Question {

	async next(session, response)
	{
		let currentQuestion = await session.question().with('conditions').first();

		let count = await currentQuestion.conditions().getCount();

		let conditions = await currentQuestion.conditions().fetch();

		conditions = count ? conditions.toJSON() : [];

		let applicableCondition = await this.applicableCondition(response, conditions);

		let nextQuestion = await this.getNextQuestion(session, currentQuestion, applicableCondition);

		if(!nextQuestion) return null;

		await this.updateSession(session, nextQuestion);

		return nextQuestion;
	}

	async applicableCondition(response, conditions)
	{
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

	async getNextQuestion(session, currentQuestion, condition)
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
			question = await QuestionRepo.nextQuestion(survey, currentQuestion.rank);
		}

		return await transform(question, 'Question');
	}

	async updateSession(session, question)
	{
		session.question_id = question.id;

		await session.save();

		return session;
	}
}

module.exports = Question;
