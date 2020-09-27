'use strict';

const Logger = use('Logger');
const Response = new(use('App/Modules/Surveys/Response'))();
const SurveyRepository = new(use('App/Modules/Surveys/SurveyRepository'))();
const SurveyHandler = new(use('App/Modules/Surveys/SurveyHandler'))();
const InstanceForm = new(use('App/Modules/Instances/Form'))();

class SurveysController {
	
	async show({ params, response })
	{
		let result = await SurveyRepository.show(params.id);
		
		return response.json(result);
	}
	
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
}

module.exports = SurveysController;