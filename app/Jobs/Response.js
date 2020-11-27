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
			Logger.log('no session found');
			return null
		};
		
		Logger.log('session found');
		
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