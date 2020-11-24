const Database = use('Database');
const CompanyModel = use('App/Models/Company');
const GroupModel = use('App/Models/Group');
const ContactModel = use('App/Models/Contact');
const InstanceModel = use('App/Models/Instance');

class Contacts {
	
	async clone(instance)
	{
		instance = await InstanceModel.query().where('id', instance.id).first();
		
		let group = await this.group(instance.group_id);
		
		if(!group) {
			return;
		}
		
		let file = await this.file(group.id);
		
		if(!file) {
			return;
		}
		
		let company = await this.company(group.customer_account);
		
		await this.contactGroup(group, company, file);
		
		instance.cloned = true;
		return instance.save ();
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
	
	async contactGroup(group, company, file)
	{
		let contactGroup = await GroupModel
			.query()
			.where('company_id', company.id)
			.where('code', group.id)
			.first();
		
		if(!contactGroup) {
			
			contactGroup = await GroupModel.create({
				title: '',
				code: group.id,
				company_id: company.id
			});
			
			return await this.contacts(contactGroup, company, file.table_name);
		}
		
		return contactGroup;
	}
	
	async contacts(group, company, table)
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
		
		return true;
	}
}

module.exports = Contacts;