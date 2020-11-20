const Database = use('Database');

class Contacts {
	async sync(instance)
	{
		let group = await Database.connection('mysqlSMS')
			.table('contact_groups')
			.where('id', instance.group_id)
			.select('*');
		
		console.log(group);
	}
}

module.exports = Contacts;