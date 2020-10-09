const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const ResponseModel = use('App/Models/Response');
const ChannelModel = use('App/Models/Channel');

const Instance = new(use('App/Modules/Responses/Instance'))();
const Session = new(use('App/Modules/Responses/Session'))();
const Question = new(use('App/Modules/Responses/Question'))();

class ResponseHandler {
	
	async handle(request)
	{
		let data = request.data;
		
		let channel = await this.type(request.type);
		
		let type = channel ? channel.slug : null;
		
		let instances = await Instance.find(data, type);
		
		if(!instances)  return 'no instance';

		let session = await Session.find(instances, data, type);
		
		let response = await this.recordResponse(session, data, channel);
		
		let nextQuestion = await Question.next (session, response);
		
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
	
	async transformForJson(question)
	{
		return {
			status: 201,
			message: 'Response saved successfully',
			question: question
		}
	}
	
	async type(type)
	{
		return ChannelModel.query ().where ('service', type).first ();
	}
	
	async recordResponse(session, data, channel)
	{
		let question = await session.question().first();
		
		let response = data.message;
		
		switch(channel.slug) {
			
			case 'sms':
				let choice = await question.choices().where('rank', data.message).first();
				response = choice && choice.id ? choice.value : data.message;
				break;
			case 'web':
			case 'chat':
				response = data.message
				break;
			default:
				response = data.message;
				break;
		}
		
		return await ResponseModel.create({
			response: response,
			question_id: question.id,
			contact_id: session.contact_id,
			session_id: session.id,
			channel_id: channel.id
		});
	}
}

module.exports = ResponseHandler;