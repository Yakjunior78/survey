const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();
const SMS = new(use('App/Services/SMS/Send'))();

const Env = use('Env');

class Response {
	async handle(data)
	{
		let channel = data.channel;
		
		data = data.data;
		
		let response = await ResponseHandler.response(data, channel);
		
		await this.reply(response)
	}
	
	async reply(response)
	{
		let data = await this.messageData(response);
		
		return await SMS.handle(data);
	}
	
	async messageData(response)
	{
		return {
			from: Env.get('DEFAULT_SHORT_CODE'),
			messages: [
				{
					recipient: '254704664119',
					message: response
				}
			]
		}
	}
}

module.exports = Response;