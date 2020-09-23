'use strict';

class ResponsesController {
	
	async handle({ request, response }) {
		
		let req = request.all();
		
		return await Response.handle(req);
	}
}

module.exports = ResponsesController;