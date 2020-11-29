const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();
const { smsReply } = use('App/Helpers/Question');

const Env = use('Env');

class InstanceQuestionHandler {
	
	async handle(instance)
	{
		let mode = await instance.interaction().first();
		
		switch(mode.slug) {
			
			case 'sms':
				return await this.sms(instance);
			
			case 'web-link':
				return await this.link(instance);
			
			default:
				return null;
		}
	}
	
	async sms(instance)
	{
		let survey = await instance.survey().first();
		
		let question = await QuestionRepo.get(survey, 1);
		
		return await smsReply(question);
	}
	
	async link(instance)
	{
		let survey = await instance.survey().first();
		
		let message = instance.introductory_message;
		
		if(message === '') {
			message = 'Hello, below is the link to '+ survey.title;
		}
		
		let link = Env.get('SURVEY_WEB_URI')+'/survey/'+survey.uuid;
		
		return message + '\n' + link;
	}
}

module.exports = InstanceQuestionHandler