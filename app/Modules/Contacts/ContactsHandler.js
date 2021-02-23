const ContactModel = use('App/Models/Contact');
const repo = new(use('App/Modules/Contacts/ContactRepository'))();
const GroupHandler = new(use('App/Modules/Contacts/Group'))();

const Database = use('Database');
const Logger = use('Logger');

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
	
	async validate(data)
	{
		let contact = await ContactModel.query().where('uuid', data.cid).first();
		
		if(!contact) {
			return await repo.createSingleContact(data);
		}
		
		return contact;
	}
	
	async clone(group, company, table)
	{
		//TODO improve data table clone
		
		let contactGroup = await GroupHandler.store({
			title: '',
			code: group.id,
			company_id: company.id
		});
		
		/**
		 * Export to a file
		 * Import from the file
		 */
		
		
		
		let contacts = await Database  // MF this can be big and it will f**k you up big time
			.connection('mysqlContacts')
			.select('msisdn')
			.from(table.table_name);
		
		for (const contact of contacts) {
			await ContactModel.create({
				group_id: contactGroup.id,
				company_id: company.id,
				msisdn: contact.msisdn,
				fname: contact.fname ? contact.fname : null,
				lname: contact.lname ? contact.lname : null
			});
		}
		
		Logger.info('ended at : ' + Date.now());
		
		return true;
	}
}

module.exports = ContactsHandler;