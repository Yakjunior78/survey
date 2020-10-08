const ContactModel = use('App/Models/Contact');

const { shortToken } = use('App/Helpers/Emalify');

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
	
	async getContact(data, group, group_ids)
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
}

module.exports = ContactRepository;