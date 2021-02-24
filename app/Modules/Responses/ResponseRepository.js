'use strict';

const InstanceModel = use('App/Models/Instance');
const SurveyModel = use('App/Models/Survey');

class ResponseRepository {
	
	async responses(data)
	{
		let instance = null;
		let survey = null;
		
		if(data.instance_id) {
			instance = await InstanceModel.findBy('uuid', data.instance_id);
		}
		
		survey = instance ?  await instance.survey().first() : await SurveyModel.findBy('uuid', data.survey_id);
		
		return {
			instance: instance,
			survey: survey
		};
	}
}

module.exports = ResponseRepository