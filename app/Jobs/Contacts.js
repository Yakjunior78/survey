const Database = use('Database');

class Contacts {
	async sync(instance)
	{
		let group = await Database.connection('mysqlSMS')
			.table('contact_groups')
			.find(instance.group_id);
		
		console.log(group);
	}
}

module.exports = Contacts;