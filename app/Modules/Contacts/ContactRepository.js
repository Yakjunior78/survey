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
}

module.exports = ContactRepository;