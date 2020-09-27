const { validate } = use('Validator');
const Event = use('Event');

const InstanceModel = use('App/Models/Instance');
const SurveyModel = use('App/Models/Survey');
const ChannelModel = use('App/Models/Channel');
const StatusModel = use('App/Models/Status');

const InstanceForm = new(use('App/Modules/Instances/Form'))();
const ContactRepository = new(use('App/Modules/Contacts/ContactRepository'))();
const SessionRepo = new(use('App/Modules/Session/SessionRepository'))();

const { isNowOrPast } = use('App/Helpers/DateHelper');
const { notAllowed } = use('App/Helpers/Response');
const { transform } = use('App/Helpers/Transformer');

class InstanceRepository {
	
	async create(survey, channel, data) {
		
		let instances = await survey.instances().count('* as total');
		
		let status = await StatusModel.query().where('slug', 'active').first();
		
		let instance = await InstanceModel.create({
			description: 'Instance ' + (instances[0].total + 1) + ' of this survey.',
			survey_id: survey.id,
			start_at: data.start_at,
			end_at: data.end_at,
			group_id: data.group_id,
			channel_id: channel.id,
			created_by: data.created_by,
			created_by_name: data.created_by_name,
			status_id: status.id,
			sender_id: data.sender_id ? data.sender_id : null
		})
		
		await this.attachQuestions(instance);
		
		let send_now = await isNowOrPast(data.start_at);
		
		if(send_now) {
			Event.fire('new::instance', instance);
		}
		
		return instance;
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
		
		let instance = await this.getInstance(data.uuid);
		
		if(!instance) return notAllowed('Survey instance not found!');
		
		let company = await this.getCompany(instance);
		
		if(!company) return notAllowed('Company instance not found!');
		
		let contact = await this.getContact(company, data.user);
		
		let session = await SessionRepo.show(contact, instance, null);
		
		if(!session) session = await SessionRepo.init(instance, contact);
		
		if(!session) return notAllowed('Survey question not set yet');
		
		return {
			question: await transform(await session.question().fetch(), 'Question'),
			contact: contact,
			instance: instance,
			survey: await transform(await instance.survey().first(), 'Survey'),
		};
	}
	
	async getInstance(id)
	{
		return InstanceModel
			.query()
			.where('uuid', id)
			.first();
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