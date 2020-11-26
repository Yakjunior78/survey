const GroupModel = use('App/Models/Group');
const ContactModel = use('App/Models/Contact');
const SessionModel = use('App/Models/Session');
const StatusModel = use('App/Models/Status');
const InstanceModel = use('App/Models/Instance');

const Database = use('Database');

class Sessions {
	
	async handle(instance)
	{
		instance = await InstanceModel.query().where('id', instance.id).first();
		
		let group = await GroupModel.query().where('code', instance.group_id).first();
		
		if(!group) {
			return instance;
		}
		
		let survey = await instance.survey().first();
		
		let question = await survey.questions().first();
		
		let status = await StatusModel.query().where('slug', 'active').first();
		
		let contacts = await ContactModel.query()
			.where('group_id', group.id)
			.fetch();
		
		contacts = contacts.toJSON();
		
		let sessions = []
		
		contacts.forEach( (contact) => {
			let cont = {
				instance_id: instance.id,
				contact_id: contact.id,
				sender_id: instance.sender_id,
				question_id: question.id,
				status_id: status.id
			}
			
			sessions.push(cont);
		});
		
		return await Database.insert(sessions).into('sessions');
	}
}

module.exports = Sessions;