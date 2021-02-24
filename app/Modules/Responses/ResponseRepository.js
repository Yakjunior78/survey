'use strict';

const InstanceModel = use('App/Models/Instance');
const SurveyModel = use('App/Models/Survey');
const ResponseModel = use('App/Models/Response');

const Database = use('Database');

class ResponseRepository {
	
	async responses(data)
	{
		let instance = null;
		let survey = null;
		
		if(data.instance_id) {
			instance = await InstanceModel.findBy('uuid', data.instance_id);
		}
		
		if(!instance) {
			return [];
		}
		
		survey = instance ?  await instance.survey().first() : await SurveyModel.findBy('uuid', data.survey_id);
		
		let channel = instance ? await instance.channel().first() : null;
		
		let sessions = await instance.sessions().fetch();
		
		let responses = await ResponseModel
			.query()
			.whereHas('session', (sessionQuery) => {
				sessionQuery.where('instance_id', instance.id)
			})
			.fetch()
		
		let questions = await instance.questions().fetch();
		
		return {
			questions: questions,
			responses: responses,
			sessions: sessions
		};
	}
}

module.exports = ResponseRepository