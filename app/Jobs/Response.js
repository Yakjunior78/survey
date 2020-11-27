const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();
const SMS = new(use('App/Services/SMS/Send'))();
const SenderModel = use('App/Models/Sender');

const Env = use('Env');
const Logger = use('Logger');

class Response {
	
	async handle(data)
	{
		let channel = data.channel;
		
		data = data.data;
		
		let session = await ResponseHandler.session(data, channel);
		
		if(!session) {
			console.log('no session found');
			return null;
		};
		
		console.log('session found');
		
		let response = await ResponseHandler.response(session, data, channel);
		
		let contact = await ContactModel.query().where('id', session.contact_id).first();
		
		if(!contact) return null;
		
		await this.reply(response, contact, data)
	}
	
	async reply(response, contact, data)
	{
		let sender = await SenderModel
			.query()
			.where('code', data.shortCode)
			.first();
		
		let from = sender ? sender.code : Env.get('DEFAULT_SHORT_CODE');
		
		console.log(contact, 'this is the contact');
		
		let messages = [];
		
		messages.push({
			recipient: contact.msisdn,
			message: response
		});
		
		return await SMS.handle({
			from: from,
			messages: messages
		});
	}
}

module.exports = Response;