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
		
		return contactModel;
	}
	
	async getContact(data, group)
	{
		if(group) {
			return ContactModel
				.query ()
				.where ('group_id', group.id)
				.where ('msisdn', data.phoneNumber)
				.first ();
		}
		
		if(data.id) {
			return ContactModel
				.query ()
				.where ('uuid', data.id)
				.first ();
		}
		
		return null;
	}
}

module.exports = ContactRepository;