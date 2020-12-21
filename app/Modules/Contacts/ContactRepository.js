const ContactModel = use('App/Models/Contact');
const GroupModel = use('App/Models/Group');
const SessionModel = use('App/Models/Session');
const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();

const { shortToken, getStatus } = use('App/Helpers/Emalify');

class ContactRepository {
	
	async createSingleContact(data, company, group)
	{
		let contactModel = new ContactModel();
		
		contactModel.company_id = company ? company.id : null;
		contactModel.fname = data && data.fname ? data.fname : 'Emalify';
		contactModel.lname = data && data.lname ? data.lname : await shortToken();
		contactModel.group_id = data && data.group_id ? data.group_id : null;
		
		await contactModel.save();
		
		return await ContactModel.query().where('id', contactModel.id).fetch();
	}
	
	async getContact(data, group, group_ids) //TODO Delete block
	{
		if(group) {
			return await ContactModel
				.query()
				.where('msisdn', data.phoneNumber)
				.whereHas('group', (group) => {
					group.whereIn('id', group_ids )
				})
				.orderBy('updated_at', 'asc')
				.fetch()
		}
		
		if(data.id) {
			return ContactModel
				.query ()
				.where ('uuid', data.id)
				.orderBy('updated_at', 'asc')
				.fetch();
		}
		
		return null;
	}
	
	async forSms(data)
	{
		return await ContactModel
			.query()
			.where('msisdn', data.phoneNumber)
			.orderBy('updated_at', 'asc')
			.fetch()
	}
	
	async forWeb(data)
	{
		return ContactModel
			.query ()
			.where ('uuid', data.id)
			.orderBy('updated_at', 'asc')
			.fetch();
	}
	
	async createContact(instance, column, id)
	{
		let group = await instance.group().first();
		
		if(!group) {
			group = await this.createGroup(instance);
		}
		
		let contact = await ContactModel
			.query()
			.where(column, id)
			.first();
		
		if(contact) {
			return contact;
		}
		
		await this.createSession(instance, contact);
		
		return ContactModel.create({
			group_id: group.id,
			[column]: id
		});
	}
	
	async createGroup(instance)
	{
		let survey = await instance.survey().first();
		
		let group = await GroupModel.create({
			code: null,
			company_id: survey.company_id
		});
		
		instance.group_id = group.id;
		
		instance.save ();
		
		return group;
	}
	
	async createSession(instance, contact)
	{
		let session = await SessionModel
			.query()
			.where('instance_id', instance.id)
			.where('contact_id', contact.id)
			.first();
		
		if(session) {
			return session;
		}
		
		let status = await getStatus('active');
		
		let survey = await instance.survey().fetch();
		
		let question = await QuestionRepo.get(survey, 1);
		
		if(!question) return null;
		
		return await SessionModel.create ({
			instance_id: instance.id,
			contact_id: contact.id,
			status_id: status ? status.id : null,
			question_id: question ? question.id : null
		});
	}
}

module.exports = ContactRepository;