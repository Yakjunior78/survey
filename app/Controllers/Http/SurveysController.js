'use strict';

const Logger = use('Logger');
const Response = new(use('App/Modules/Surveys/Response'))();

class SurveysController {
	
	async initiate({ request, response }) {
	
	}
	
	async responseHook({ request }) {
		
		let req = request.all();
		
		return await Response.handle(req);
	}
}

module.exports = SurveysController;