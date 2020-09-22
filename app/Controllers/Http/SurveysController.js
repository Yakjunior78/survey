'use strict';

const Logger = use('Logger');
const Response = new(use('App/Modules/Surveys/Response'))();
const SurveyRepository = new(use('App/Modules/Surveys/SurveyRepository'))();
const SurveyHandler = new(use('App/Modules/Surveys/SurveyHandler'))();
const InstanceForm = new(use('App/Modules/Instances/Form'))();

class SurveysController {
	
	async store({ request, response })
	{
		let req = request.all();
		
		let result = await SurveyRepository.create(req);
		
		return response.json(result);
	}
	
	async initiate({ request, response })
	{
		let data = request.all();
		let validation = await InstanceForm.validate(data);
		
		if (validation.fails()) {
			return InstanceForm.error(validation);
		}
		
		return response.json(await SurveyHandler.initiate(data));
	}
	
	async initialize({ request, response })
	{
		let req = request.all();
		
		return response.json(request);
	}
	
	async responseHook({ request })
	{
		let req = request.all();
		
		return await Response.handle(req);
	}
}

module.exports = SurveysController;