'use strict';

const InstanceModel = use('App/Models/Instance');
const SurveyModel = use('App/Models/Survey');
const Database = use('Database');

class ResponseRepository {
	
	async responses(data)
	{
		let instance = null;
		let survey = null;
		
		if(data.instance_id) {
			instance = await InstanceModel.findBy('uuid', data.instance_id);
		}
		
		survey = instance ?  await instance.survey().first() : await SurveyModel.findBy('uuid', data.survey_id);
		
		let channel = instance ? await instance.channel().first() : null;
		
		let responses = await Database
			.table('responses')
			.whereHas('session', (sessionQuery) => {
				sessionQuery.whereHas('instances', (instanceQuery) => {
					instanceQuery.where('uuid', instance.uuid)
				})
			})
		
		// await Database.
		
		return {
			instance: instance,
			survey: survey,
			responses: responses
		};
	}
}

module.exports = ResponseRepository