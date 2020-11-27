const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();
const SMS = new(use('App/Services/SMS/Send'))();
const SenderModel = use('App/Models/Sender');

const Env = use('Env');

class Response {
	
	async handle(data)
	{
		let channel = data.channel;
		
		data = data.data;
		
		let session = await ResponseHandler.session(data, channel);
		
		console.log(session, 'this is the session');
		
		if(!session) return null;
		
		let response = await ResponseHandler.response(session, data, channel);
		
		
		
		let contact = await session.contact;
		
		if(!contact) return null;
		
		await this.reply(response, contact, data)
	}
	
	async reply(response, contact, data)
	{
		let sender = await SenderModel.where('code', data.shortCode).first();
		
		let from = sender ? sender.code : Env.get('DEFAULT_SHORT_CODE');
		
		let payload = {
			from: from,
			messages: [
				{
					recipient: contact.msisdn,
					message: response
				}
			]
		}
		
		return await SMS.handle(payload);
	}
}

module.exports = Response;