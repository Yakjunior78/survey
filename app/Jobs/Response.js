const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();

class Response {
	async handle(data)
	{
		let channel = data.channel;
		
		data = data.data;
		
		let response = await ResponseHandler.response(data, channel);
		
		console.log(response, 'this is the response');
	}
}

module.exports = Response;