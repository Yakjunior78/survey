const Database = use('Database');

const CompanyModel = use('App/Models/Company');
const GroupModel = use('App/Models/Group');
const ContactModel = use('App/Models/Contact');

const getGroup = async (id) =>
{
	return Database.connection ('mysqlSMS')
		.from ('contact_groups')
		.where ('id', id)
		.first ();
};

const getFile = async (id) =>
{
	return Database.connection ('mysqlSMS')
		.from ('file_upload_queues')
		.where ('contact_groups_id', id)
		.first ();
};

const getCompany = async (account) =>
{
	let company = await CompanyModel.query().where('identity', account).first();
	
	return company ? company : await createCompany(account);
}

const contactGroup = async (group, company, file) =>
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

async function createCompany(account) {
	return await CompanyModel.create({
		name: account,
		slug: account,
		description: 'Company with customer account '+account,
		identity: account
	});
}

async function contacts(group, company, table)
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

module.exports = {
	getGroup,
	getFile,
	getCompany
}