const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();

class Response {
	async handle(data)
	{
		data = data.data;
		let channel = data.channel;
		
		let response = await ResponseHandler.response(data, channel);
		
		console.log(response, 'this is the response');
	}
}

module.exports = Response;