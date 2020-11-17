'use strict';
const Logger = use('Logger');

const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();

class ResponsesController {
	
	async handle({ request, response })
	{
		let req = request.all();
		
		// Logger.info('handling response');
		
		return response.json(await ResponseHandler.handle(req));
	}
}

module.exports = ResponsesController;