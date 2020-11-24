const GroupModel = use('App/Models/Group');
const ContactModel = use('App/Models/Contact');
const SessionModel = use('App/Models/Session');

class Sessions {
	
	async handle(instance)
	{
		instance = await InstanceModel.query().where('id', instance.id).first();
		
		let group = await GroupModel.query().where('code', instance.group_id).first();
		
		if(!group) {
			return instance;
		}
		
		let contacts = await ContactModel.query()
			.where('group_id', group.code)
			.fetch();
		
		contacts = contacts.toJSON();
		
		for(let i in contacts.rows) {
			let cont = {
				instance_id: instance.id,
				contact_id: contacts.rows[i],
				sender_id: instance.sender_id,
			}
			
			contacts.push(cont);
		}
		
		return SessionModel.createMany(contacts);
	}
}

module.exports = Sessions;