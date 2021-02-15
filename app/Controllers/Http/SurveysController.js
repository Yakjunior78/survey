'use strict';

const Logger = use('Logger');
const Response = new(use('App/Modules/Surveys/Response'))();
const SurveyRepository = new(use('App/Modules/Surveys/SurveyRepository'))();
const InstanceForm = new(use('App/Modules/Instances/Form'))();

class SurveysController {
	
	async index({ request, response })
	{
		request = request.all();
		
		let result = await SurveyRepository.index(request.identity);
		
		return response.json(result);
	}
	
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
	
	async update({ request, params, response })
	{
		let result = await SurveyRepository.update(params.id, request.all());
		return response.json(result);
	}
	
	async destroy({ params, response })
	{
		let result = await SurveyRepository.destroy(params.id);
		return response.json(result);
	}
}

module.exports = SurveysController;