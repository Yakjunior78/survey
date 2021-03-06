const QuestionModel = use('App/Models/Question');
const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();
const Link = new(use('App/Modules/Instances/Link'))();
const { smsReply } = use('App/Helpers/Question');

const Env = use('Env');

class InstanceQuestionHandler {

	async handle(instance)
	{
		let mode = await instance.interaction().first();

		console.log('3:Mode found', mode)

		switch(mode.slug) {

			case 'sms':
				return await this.sms(instance);

			case 'web-link':
				return Link.generate(instance);

			default:
				return null;
		}
	}

	async sms(instance)
	{
		let survey = await instance.survey().first();
		console.log('4:Survey found');

		let question = instance.consent_question_id
			? await QuestionModel.find(instance.consent_question_id)
			:   await QuestionRepo.get(survey, 1);

		if(!question) {
			return 'Would you wish to partake in this survey?';
		}

		console.log('5:Message found');

		return await smsReply(question);
	}
}

module.exports = InstanceQuestionHandler
