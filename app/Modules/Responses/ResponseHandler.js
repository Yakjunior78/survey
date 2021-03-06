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
const { publish } = use('App/Services/Messaging/RedisPubSubHandler');

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
			'response:received'
		);
	}

	async respond(data, channel)
	{
		let session = await this.session(data, channel);

		if(!session) return null;

		return this.response (session, data, channel);
	}

	async response(session, data, channel)
	{
		let response = await Response.record (session, data, channel);

		if(!response) {
			console.log('HANDLE RESPONSE 4: response not found!');
			let current = await session.question ().with ('conditions').first ();
			return await this.reply(current, channel, true);
		}

		console.log('HANDLE RESPONSE 4: response found!');

		let nextQuestion = await Question.handle(session, response);

		await this.updateSession(session, nextQuestion);

		return await this.reply(nextQuestion, channel);
	}

	async session(data, channel)
	{
		let contacts = await ContactHandler.find(data, channel);

		if(!contacts) {
			console.log('HANDLE RESPONSE 1: no contact found!');
			return null
		}

		console.log('HANDLE RESPONSE 1: contacts found!');

		let instances = null;

		if(data.instanceId) {
			instances = await InstanceModel.query().where('uuid', data.instanceId).fetch();
		} else {
			instances = await Instance.find(data, contacts, channel);
		}

		if(!instances) {
			console.log('HANDLE RESPONSE 2: no instance found!');
			return null
		}

		console.log('HANDLE RESPONSE 2: instance found!');

		return await SessionHandler.handle (contacts, instances);
	}

	async updateSession(session, question)
	{
		return await SessionHandler.update(session, question);
	}

	async reply(question, channel, repeat)
	{
		console.log('AT REPLY');

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
