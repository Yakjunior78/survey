const ContactRepo = new(use('App/Modules/Contacts/ContactRepository'))();
const ContactModel = use('App/Models/Contact');

class Contact {
	
	async find(instances, data, type)
	{
		switch(type) {
			case 'sms':
				return await this.forSms(data, instances);
			case 'web':
				return await ContactRepo.getContact(data);
			default:
				return null;
		}
	}
	
	async forSms(data, instances)
	{
		instances = instances.toJSON();
		
		let group_ids = [];
		
		for (let i = 0; i < instances.length; i++) {
			await group_ids.push((instances[i].group_id));
		}
		
		return await ContactRepo.getContact(data, true, group_ids);
	}
}

module.exports = Contact;