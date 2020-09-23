'use strict';

const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();

class ResponsesController {
	
	async handle({ request, response })
	{
		let req = request.all();
		
		let result = await ResponseHandler.handle (req);
		
		if(req.type === 'onDemandNotification') {
			return result;
		}

		return response.json(result);
	}
}

module.exports = ResponsesController;