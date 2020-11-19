const Database = use('Database');

class Contacts {
	async sync(instance)
	{
		let groups = await Database.connection('mysqlSMS').table('contact_groups').select('*');
		
		console.log(groups);
	}
}

module.exports = Contacts;