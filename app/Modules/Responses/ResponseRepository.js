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
		
		if(!instance) {
			return [];
		}
		
		survey = instance ?  await instance.survey().first() : await SurveyModel.findBy('uuid', data.survey_id);
		
		let channel = instance ? await instance.channel().first() : null;
		
		let responses = await Database
			.select( '*' )
			.from('responses')
			.leftJoin('questions', 'responses.question_id', 'questions.id')
			.leftJoin('sessions', 'sessions.session_id', 'sessions.id')
			.innerJoin('sessions', () => {
				this.on('sessions.instance_id', instance.id)
			})
		
		return {
			instance: instance,
			survey: survey,
			responses: responses
		};
	}
}

module.exports = ResponseRepository