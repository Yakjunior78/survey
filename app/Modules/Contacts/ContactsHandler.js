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
		let contactGroup = await GroupHandler.store({
			title: '',
			code: group.id,
			company_id: company.id
		});
		
		let contacts = await Database
			.connection('mysqlContacts')
			.select('msisdn')
			.from(table.table_name);
		
		console.log(contacts, 'these are the contacts');
		
		// let query = "SELECT * INTO OUTFILE 'tmp/result.csv' FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '' LINES TERMINATED BY '\n' FROM "+table.table_name;
		//
		// let data = await Database.connection('mysqlContacts').raw(query);
		//
		// console.log(data, 'this is the data');
		
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