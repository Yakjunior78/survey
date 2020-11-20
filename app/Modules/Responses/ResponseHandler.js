const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const ChannelModel = use('App/Models/Channel');
const SessionModel = use('App/Models/Session');

const Instance = new(use('App/Modules/Responses/Instance'))();
const Session = new(use('App/Modules/Responses/Session'))();
const Question = new(use('App/Modules/Responses/Question'))();
const Response = new(use('App/Modules/Responses/Response'))();
const ContactHandler = new(use('App/Modules/Contacts/ContactsHandler'))();
const SessionHandler = new(use('App/Modules/Session/SessionHandler'))();

const { smsReply, jsonReply } = use('App/Helpers/Question');
const { publish } = use('App/Services/Messaging/PubSubHandler');

const Logger = use('Logger');
const Env = use('Env');

class ResponseHandler {
	
	async handle(data, channel)
	{
		switch(channel.slug) {
			case 'sms':
				return await this.response(data, channel);
				// return await this.publish(data, channel);
			case 'web':
			case 'chat':
				return await this.response(data, channel);
			default:
				return 'unknown survey channel';
		}
	}
	
	async publish(data, channel)
	{
		return await publish(
			{
				data: data,
				channel: channel
			},
			Env.get('HANDLE_RESPONSE'),
			'handle_response'
		);
	}
	
	async response(data, channel)
	{
		let contacts = await ContactHandler.find(data, channel);
		
		let instances = await Instance.find(data, contacts, channel);
		
		if(!instances) return 'Unable to proceed';
		
		let session = await SessionHandler.handle(contacts, instances);
		
		if(!session) return null;
		
		let response = await Response.record(session, data, channel);
		
		return {
			response: response
		}
		
		let next = await Question.handle(session, response);
		
		await SessionHandler.update(session, next);
		
		return await this.reply(next, channel);
	}
	
	async reply(question, channel)
	{
		switch(channel.slug) {
			case 'sms':
				return await smsReply(question);
			case 'web':
			case 'chat':
				return await jsonReply(question);
			default:
				return null;
		}
	}
	
	async type(type)
	{
		return ChannelModel.query ().where ('service', type).first ();
	}
}

module.exports = ResponseHandler;