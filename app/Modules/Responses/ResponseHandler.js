const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const ChannelModel = use('App/Models/Channel');
const InstanceModel = use('App/Models/Instance');
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
				return await this.publish(data, channel);
			case 'web':
			case 'chat':
				return await this.respond(data, channel);
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
	
	async respond(data, channel)
	{
		let session = await this.session(data, channel);
		
		console.log(session, 'this is the session');
		
		if(!session) return null;
		
		return this.response (session, data, channel);
	}
	
	async response(session, data, channel)
	{
		let response = await Response.record (session, data, channel);
		
		if(!response) {
			let current = await session.question ().with ('conditions').first ();
			return await this.reply(current, channel, true);
		}
		
		return response;
		
		let nextQuestion = await Question.handle(session, response);
		
		await this.updateSession(session, nextQuestion);
		
		return await this.reply(nextQuestion, channel);
	}
	
	async session(data, channel)
	{
		let contacts = await ContactHandler.find(data, channel);
		
		if(!contacts) {
			console.log(instances, 'there are no contacts found');
			return null
		}
		
		let instances = null;
		
		if(data.instanceId) {
			instances = await InstanceModel.query().where('uuid', data.instanceId).fetch();
		} else {
			instances = await Instance.find(data, contacts, channel);
		}
		
		if(!instances) {
			console.log(instances, 'there are no instances found');
			return null
		}

		return await SessionHandler.handle (contacts, instances);
	}
	
	async updateSession(session, question)
	{
		return await SessionHandler.update(session, question);
	}
	
	async reply(question, channel, repeat)
	{
		switch(channel.slug) {
			case 'sms':
				return await smsReply(question, repeat);
			case 'web':
			case 'chat':
				return await jsonReply(question, repeat);
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