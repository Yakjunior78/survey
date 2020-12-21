const { validate } = use('Validator');
const Event = use('Event');

const InstanceModel = use('App/Models/Instance');
const SurveyModel = use('App/Models/Survey');
const ChannelModel = use('App/Models/Channel');
const StatusModel = use('App/Models/Status');
const InteractionModel = use('App/Models/Interaction');

const InstanceForm = new(use('App/Modules/Instances/Form'))();
const ContactRepository = new(use('App/Modules/Contacts/ContactRepository'))();
const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();
const SurveyHandler = new(use('App/Modules/Surveys/SurveyHandler'))();

const { isNowOrPast } = use('App/Helpers/DateHelper');
const { notAllowed } = use('App/Helpers/Response');
const { transform } = use('App/Helpers/Transformer');
const moment = use('moment');

class InstanceRepository {
	
	async store(data)
	{
		let validation = await InstanceForm.validate(data);
		
		if (validation.fails()) {
			return InstanceForm.error(validation);
		}
		
		let survey =  await this.getSurvey(data.survey_id);
		
		if(!survey) {
			return notAllowed('Survey not found');
		}
		
		let channel = await ChannelModel.findOrFail(data.channel_id);
		
		if(data.id) {
			data.survey_id = survey.id;
			return await this.update(data.id, data);
		}
		
		let instance  = await this.create(survey, channel, data);
		
		return {
			status: 201,
			message: 'Survey instance created successfully',
			instance: instance
		};
	}
	
	async create(survey, channel, data) {
		
		let instances = await survey.instances().count('* as total');
		
		let status = await StatusModel.query().where('slug', 'active').first();
		
		let start = data.start_at ? data.start_at : Date.now();
		
		let interaction = await this.interaction(channel, data);
		
		let instance = await InstanceModel.create({
			description: 'Instance ' + (instances[0].total + 1) + ' of this survey.',
			survey_id: survey.id,
			start_at: moment(start).format('YYYY-MM-DD HH:mm:ss'),
			end_at: moment(data.end_at).format('YYYY-MM-DD HH:mm:ss'),
			group_id: data.group_id ? data.group_id : null,
			channel_id: channel.id,
			created_by: data.created_by,
			created_by_name: data.created_by_name,
			status_id: status.id,
			sender_id: data.sender_id ? data.sender_id : null,
			consent_question_id: data.consent_question_id,
			introductory_message: data.introductory_message,
			interaction_id: interaction ? interaction.id : null
		});
		
		await this.attachQuestions(instance);
		
		return instance;
	}
	
	async interaction(channel, data)
	{
		if(data.interaction_id) {
			return await InteractionModel.find(data.interaction_id);
		}
		
		return await InteractionModel
			.query()
			.where('slug', 'web-link')
			.where('channel_id', channel.id)
			.first()
	}
	
	async update(id, data)
	{
		await InstanceModel
			.query()
			.where('id', id)
			.update(data);
		
		let instance = await InstanceModel
			.query()
			.where('id', id)
			.first();
		
		return {
			status: 201,
			message: 'Survey instance updated successfully',
			instance: instance
		};
	}
	
	async destroy(id)
	{
		let instance = await InstanceModel
			.query()
			.where('uuid', id)
			.find(id);
		
		await instance.delete();
		
		return {
			'message': 'Survey instance deleted successfully',
			'status': 201
		}
	}
	
	async getSurvey(id) {
		return SurveyModel
			.query ()
			.where ('uuid', id)
			.first ();
	}
	
	async attachQuestions(instance) {
		
		let survey = await instance.survey().first();
		
		let questions = await survey.questions().fetch();
		
		for(let i in questions.rows) {
			const question = questions.rows[i];
			await instance.questions().attach([question.id]);
		}
		
		return questions;
	}
	
	async initialize(data)
	{
		let validation = await InstanceForm.validateInstance(data);
		
		if (validation.fails()) {
			return InstanceForm.error(validation);
		}
		
		let instance = data && data.uuid ? await this.getInstance(data.uuid) : null;
		
		if(!instance) return notAllowed('Survey instance not found!');
		
		let company = await this.getCompany(instance);
		
		if(!company) return notAllowed('Company instance not found!');
		
		let contact = await this.getContact(company, data.user);
		
		let contacts = contact.toJSON();
		
		let session = await SessionRepo.show(contacts[0], instance, null);
		
		if(!session) session = await SessionRepo.init(instance, contacts[0]);
		
		if(!session) return notAllowed('Survey question not set yet');
		
		return {
			question: await transform(await session.question().fetch(), 'Question'),
			contact: contacts[0],
			instance: instance,
			survey: await transform(await instance.survey().first(), 'Survey'),
		};
	}
	
	async getInstance(id, )
	{
		return InstanceModel
			.query()
			.where('uuid', id)
			.first();
	}
	
	async getInstances(id, channel)
	{
		return InstanceModel
			.query()
			.where('uuid', id)
			.whereHas('channel', (chann) => {
				chann.where('slug', channel)
			})
			.fetch();
	}
	
	async getCompany(instance)
	{
		let survey = await instance.survey().first();
		
		if(!survey) return null;
		
		return survey.company ().first ();
	}
	
	async getContact(company, data)
	{
		let contact = data ? await ContactRepository.getContact(data, null) : null;
		
		if(!contact) {
			contact = await ContactRepository.createSingleContact(data, company, null);
		}
		
		return contact;
	}
}

module.exports = InstanceRepository;