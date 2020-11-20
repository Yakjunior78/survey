const Database = use('Database');

class Contacts {
	async sync(instance)
	{
		let group = await Database.connection('mysqlSMS')
			.from('contact_groups')
			.where('id', instance.group_id)
			.first();
		
		console.log(group.id);
	}
}

module.exports = Contacts;