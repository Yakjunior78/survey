const SessionModel = use('App/Models/Session');
const ContactModel = use('App/Models/Contact');
const SessionTrailModel = use('App/Models/SessionTrail');
const InstanceModel = use('App/Models/Instance');

const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();

const { getStatus } = use('App/Helpers/Emalify');
const { notAllowed } = use('App/Helpers/Response');
const { mapIds } = use('App/Helpers/Emalify');

class SessionRepository {
	
	async find(contacts, instances)
	{
		let contact_ids = await mapIds(contacts.toJSON(), 'id');
		let instance_ids = await mapIds(instances.toJSON(), 'id');
		
		return SessionModel
			.query ()
			.whereIn ('contact_id', contact_ids)
			.whereIn ('instance_id', instance_ids)
			.whereHas ('status', (status) => {
				status.where ('slug', 'active');
			})
			.orderBy ('updated_at', 'asc')
			.first ();
	}
	
	async init(instance, contact) //TODO to be removed
	{
		let survey = await instance.survey().fetch();
		
		let question = await QuestionRepo.get(survey, 1);
		
		if(!question) return null;
		
		return await this.create(instance, contact, question);
	}
	
	async create(contact, instance)
	{
		instance = await InstanceModel.query().where('id', instance.id).first();
		
		let selectedContact = await ContactModel.query()
			.where('msisdn', contact.msisdn)
			.where('group_id', contact.group_id)
			.first();
		
		let status = await getStatus('active');
		
		let survey = await instance.survey().fetch();
		
		let question = await QuestionRepo.get(survey, 1);
		
		if(!question) return null;
		
		let session = await SessionModel.create ({
			instance_id : instance.id,
			contact_id : selectedContact.id,
			status_id :  status ? status.id : null
		});
		
		await SessionTrailModel.create({
			session_id: session.id,
			question_id: question.id,
			consent: true
		});
		
		return session;
	}
	
	async checkExpiry(contact, instance)
	{
		return SessionModel
			.query ()
			.where ('contact_id', contact.id)
			.where ('instance_id', instance.id)
			.first ();
	}
	
	async show(contact, instance, sender)
	{
		if(instance) {
			return SessionModel
				.query ()
				.where ('instance_id', instance.id)
				.whereHas ('status', (status) => {
					status.where('slug', 'active');
				})
				.where('contact_id', contact.id)
				.first ();
		}
		
		if(sender) {
			return SessionModel
				.query ()
				.where ('sender_id', sender.id)
				.whereHas ('status', (status) => {
					status.where('slug', 'active');
				})
				.where ('contact_id', contact.id)
				.first ();
		}
		
		return null;
	}
	
	async update(session, next)
	{
		await session.save();
		
		return session;
	}
}

module.exports = SessionRepository;