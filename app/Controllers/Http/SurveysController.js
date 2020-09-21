'use strict';

const Logger = use('Logger');
const Response = new(use('App/Modules/Surveys/Response'))();
const SurveyRepository = new(use('App/Modules/Surveys/SurveyRepository'))();
const InstanceRepository = new(use('App/Modules/Instances/InstanceRepository'))();

class SurveysController {
	
	async store({ request, response }) {
		
		let req = request.all();
		
		let result = await SurveyRepository.create(req);
		
		return response.json(result);
	}
	
	async initiate({ request, response }) {
		
		let req = request.all();
		
		let result = await InstanceRepository.create(req);
		
		return response.json(result);
	}
	
	async responseHook({ request }) {
		
		let req = request.all();
		
		return await Response.handle(req);
	}
}

module.exports = SurveysController;