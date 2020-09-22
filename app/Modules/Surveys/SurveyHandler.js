'use strict';

const SurveyModel = use('App/Models/Survey');
const ChannelModel = use('App/Models/Channel');
const InstanceRepository = new(use('App/Modules/Instances/InstanceRepository'))();
const { notAllowed } = use('App/Helpers/Response')

class SurveyHandler {
	
	async initiate(data) {
		
		let survey =  await this.getSurvey(data.survey_id);
		
		if(!survey) {
			return notAllowed('Survey not found');
		}
		
		let channel = await ChannelModel.findOrFail(data.channel_id);
		
		return InstanceRepository.create (survey, channel, data);
	}
	
	async getSurvey(id) {
		return SurveyModel
			.query ()
			.where ('uuid', id)
			.first ();
	}
}

module.exports = SurveyHandler;