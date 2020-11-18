const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const ChannelModel = use('App/Models/Channel');
const SessionModel = use('App/Models/Session');

const Instance = new(use('App/Modules/Responses/Instance'))();
const Session = new(use('App/Modules/Responses/Session'))();
const Question = new(use('App/Modules/Responses/Question'))();
const Response = new(use('App/Modules/Responses/Response'))();
const ContactHandler = new(use('App/Modules/Contacts/ContactsHandler'))();
const SessionHandler = new(use('App/Modules/Session/SessionHandler'))();

const Logger = use('Logger');

class ResponseHandler {
	
	async handle(data, channel)
	{
		let contacts = await ContactHandler.find(data, channel);
		
		let instances = await Instance.find(data, contacts, channel);
		
		if(!instances) return 'Unable to proceed';
		
		let session = await SessionHandler.handle(contacts, instances);
		
		if(!session) return null;
		
		let response = await Response.record(session, data, channel);
		
		let nextQuestion = await Question.handle(session, response);
		
		return await this.transform(nextQuestion, channel);
	}
	
	async transform(question, channel)
	{
		switch(channel.slug) {
			case 'sms':
				return await this.transformForSms(question);
			case 'web':
			case 'chat':
				return await this.transformForJson(question);
			default:
				return null;
		}
	}
	
	async transformForSms(question)
	{
		if(question && !question.id) {
			return 'Thank you for participating in our survey. Good bye.'
		}
		
		let description = question.question;
		
		let type = await question.questionType;
		
		let choice_string = '';
		
		switch(type.slug) {
			case 'multiple_choice':
				let choices = question.options;
				choice_string = await this.formatChoices(choices);
				break;
			case 'open_ended':
				choice_string = '';
				break;
			default:
				choice_string = '';
				break;
		}
		
		return description + '\n' + choice_string;
	}
	
	async transformForJson(question)
	{
		return {
			status: 201,
			message: 'Response saved successfully',
			question: question
		}
	}
	
	async formatChoices(choices)
	{
		let reply = 'Reply with: ';
		
		choices = choices.toJSON();
		
		for (let i = 0; i < choices.length; i++) {
			let value = choices[i].rank;
			let label = choices[i].label;
			
			let choiceString = '\n '+ '('+value+') '+label;
			
			reply = reply + ' ' + choiceString;
		}
		
		return reply;
	}
	
	async type(type)
	{
		return ChannelModel.query ().where ('service', type).first ();
	}
}

module.exports = ResponseHandler;