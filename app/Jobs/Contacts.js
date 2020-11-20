const Database = use('Database');

class Contacts {
	async sync(instance)
	{
		let group = await this.group(instance.group_id);
		
		if(!group) {
			return;
		}
		
		let file = await this.file(group.id);
		
		if(!file) {
			return;
		}
		
		let contacts = await this.contacts(file.table_name);
		
		console.log(contacts);
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
	
	async contacts(table)
	{
		return await Database
			.connection('mysqlContacts')
			.from(table)
			.all();
	}
}

module.exports = Contacts;