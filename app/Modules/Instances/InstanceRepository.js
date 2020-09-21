const { validate } = use('Validator');
const Event = use('Event');

const InstanceModel = use('App/Models/Instance');
const SurveyModel = use('App/Models/Survey');
const ChannelModel = use('App/Models/Channel');

const InstanceForm = new(use('App/Modules/Instances/Form'))();
const { isNowOrPast } = use('App/Helpers/DateHelper')

class InstanceRepository {
	
	async create(data) {
		
		let validation = await InstanceForm.validate(data);
		
		if (validation.fails()) {
			return InstanceForm.error(validation);
		}
		
		let survey =  await SurveyModel.query().where('uuid', data.survey_id).first();
		
		if(!survey) {
			return {
				status: 406,
				message: 'Model survey with such id was not found'
			}
		}
		
		let channel = await ChannelModel.query().where('id', data.channel_id).first();
		
		if(!channel) {
			return {
				status: 406,
				message: 'Selected channel is not active'
			}
		}
		
		let instances = await survey.instances().count('* as total');
		
		let instanceModel = new InstanceModel;
		
		instanceModel.description = 'Instance ' + (instances[0].total + 1) + ' of this survey.';
		instanceModel.survey_id = survey.id;
		instanceModel.start_at = data.start_at;
		instanceModel.end_at = data.end_at;
		instanceModel.group_id = data.group_id;
		instanceModel.channel_id = channel.id;
		instanceModel.created_by = data.created_by;
		instanceModel.created_by_name = data.created_by_name;
		instanceModel.status_id = data.status_id;
		
		await instanceModel.save();
		
		let instance = await InstanceModel.find(instanceModel.id);
		
		await this.attachQuestions(instance);
		
		let send_now = await isNowOrPast(data.start_at);
		
		if(send_now) {
			Event.fire('new::instance', instance);
		}
		
		return instance;
	}
	
	async attachQuestions(instance) {
		
		let survey = await instance.survey().fetch();
		
		let questions = await survey.questions().fetch();
		
		for(let i in questions.rows) {
			const question = questions.rows[i];
			await instance.questions().attach([question.id]);
		}
		
		return questions;
	}
}

module.exports = InstanceRepository;