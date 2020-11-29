'use strict';

const SurveyService = use('App/Services/Survey/Dispatch');

class DispatchSurveyController {
	
	constructor () {
		this.surveyService = new SurveyService;
	}
	
	async dispatch({ params, response })
	{
		await this.surveyService(params.id).handle();
		
		return response.json({
			status: 201
		});
	}
}

module.exports = DispatchSurveyController;