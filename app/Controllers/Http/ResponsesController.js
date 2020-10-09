'use strict';

const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();

class ResponsesController {
	
	async handle({ request, response })
	{
		let req = request.all();
		
		return await ResponseHandler.handle(req);
	}
}

module.exports = ResponsesController;