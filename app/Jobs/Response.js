const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();
const SMS = new(use('App/Services/SMS/Send'))();
const SenderModel = use('App/Models/Sender');
const ContactModel = use('App/Models/Contact');

const Env = use('Env');
const Logger = use('Logger');

class Response {

	async handle(data)
	{
		let channel = data.channel;

		data = data.data;

		let session = await ResponseHandler.session(data, channel);

		if(!session) {
			console.log('HANDLE RESPONSE 3: session not found!');
			return null;
		}

		console.log('HANDLE RESPONSE 3: session found!');

		let response = await ResponseHandler.response(session, data, channel);

		let contact = await ContactModel.query().where('id', session.contact_id).first();

		if(!contact) {
			return null
		}

		return await this.reply(response, contact)
	}

	async reply(response, contact)
	{
		return await SMS.handle({
			'profileID': '1',
			'message': response,
			'destination': contact.msisdn,
			'providerCode': 'AT',
			'type': 'singlesms'
		});
	}
}

module.exports = Response;
