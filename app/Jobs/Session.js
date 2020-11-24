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
			.map( (contact) => {
				return {
					instance_id: instance.id,
					contact_id: contact.id,
					sender_id: instance.sender_id,
				}
			});
		
		return SessionModel.createMany(contacts);
	}
}

module.exports = Sessions;