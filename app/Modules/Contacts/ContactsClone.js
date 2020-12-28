'use strict';

const Database = use('Database');

const CompanyModel = use('App/Models/Company');
const GroupHandler = new(use('App/Modules/Contacts/Group'))();

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

		return await GroupHandler.getByCode (group.id);
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
}

module.exports = ContactsClone