const ContactModel = use('App/Models/Contact');
const repo = new(use('App/Modules/Contacts/ContactRepository'))();

class ContactsHandler {
	
	async find(data, channel)
	{
		switch(channel.slug) {
			case 'sms':
				return await repo.forSms(data);
			case 'web':
				return await repo.forWeb(data);
			default:
				return null;
		}
	}
}

module.exports = ContactsHandler;