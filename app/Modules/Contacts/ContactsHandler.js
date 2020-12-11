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
	
	async clone(group, company, file)
	{
		Logger.info('started at : ' + Date.now());
		
		let contactGroup = await GroupHandler.getByCode(group.id);
		
		if(!contactGroup) {
			
			contactGroup = await GroupHandler.store({
				title: '',
				code: group.id,
				company_id: company.id
			});
			
			return await this.cloneContacts(contactGroup, company, file.table_name);
		}
		
		return contactGroup;
	}
	
	async cloneContacts(group, company, table)
	{
		let contacts = await Database
			.connection('mysqlContacts')
			.select('msisdn', 'fname', 'lname', 'network')
			.from(table);
		
		for (const contact of contacts) {
			await ContactModel.create({
				group_id: group.id,
				company_id: company.id,
				msisdn: contact.msisdn,
				fname: contact.fname,
				lname: contact.lname
			});
		}
		
		Logger.info('ended at : ' + Date.now())
		return true;
	}
}

module.exports = ContactsHandler;