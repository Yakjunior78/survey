'use strict';

const Database = use('Database');
const Logger = use('Logger');

const CompanyModel = use('App/Models/Company');
const ContactModel = use('App/Models/Contact');

const GroupHandler = new(use('App/Modules/Contacts/Group'))();
const ContactHandler = new(use('App/Modules/Contacts/ContactsHandler'))();

class ContactsClone {
	
	async handle(instance)
	{
		let group = await this.group(instance.group_id);
		
		console.log(group, 'this is the group');
		
		if(!group) {
			console.log('Contact group was not identified');
			return;
		}
		
		let file = await this.file(group.id);
		
		if(!file) {
			console.log('Contact group details was not identified');
			return;
		}
		
		let company = await this.company(group.customer_account);
		
		let contactGroup = await GroupHandler.getByCode(group.id);
		
		if(contactGroup) {
			console.log('Contacts already cloned');
			return;
		}
		
		console.log('Cloning contacts');
		return await ContactHandler.clone(group, company, file);;
	}
	
	async group(id)
	{
		return Database.connection ('mysqlSMS')
			.from ('contact_groups')
			.where ('id', id)
			.first ();
	}
	
	async file(id)
	{
		return Database.connection ('mysqlSMS')
			.from ('file_upload_queues')
			.where ('contact_groups_id', id)
			.first ();
	}
	
	async company(account)
	{
		let company = await CompanyModel.query().where('identity', account).first();
		
		if(!company) {
			company = await CompanyModel.create({
				name: account,
				slug: account,
				description: 'Company with customer account '+account,
				identity: account
			})
		}
		
		return company;
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

module.exports = ContactsClone