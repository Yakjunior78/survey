const ContactModel = use('App/Models/Contact');

const { shortToken } = use('App/Helpers/Emalify');

class ContactRepository {
	
	async createSingleContact(company, group, data)
	{
		let contactModel = new ContactModel();
		
		contactModel.company_id = company ? company.id : null;
		contactModel.fname = data && data.fname ? data.fname : 'Emalify';
		contactModel.lname = data && data.lname ? data.lname : await shortToken();
		contactModel.group_id = data && data.group_id ? data.group_id : null;
		
		await contactModel.save();
		
		return contactModel;
	}
	
	async getContact(company, group, data)
	{
		if(company) {
			return ContactModel
				.query ()
				.where ('company_id', company.id)
				.where ('uuid', data.id)
				.first ();
		}
		
		if(group) {
			return ContactModel
				.query ()
				.where ('group_id', group.id)
				.where ('msisdn', data.phoneNumber)
				.first ();
		}
		
		return null;
	}
}

module.exports = ContactRepository;