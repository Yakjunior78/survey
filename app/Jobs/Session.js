const GroupModel = use('App/Models/Group');
const ContactModel = use('App/Models/Contact');
const SessionModel = use('App/Models/Session');
const StatusModel = use('App/Models/Status');
const InstanceModel = use('App/Models/Instance');

const Database = use('Database');
const moment = use('moment');
const { shortToken } = use('App/Helpers/Emalify');

class Sessions {
	
	async handle(instance)
	{
		instance = await InstanceModel.query().where('id', instance.id).first();
		
		if(!instance) {
			return;
		}
		
		let group = await GroupModel.query().where('code', instance.group_id).first();
		
		if(!group) {
			return instance;
		}
		
		let survey = await instance.survey().first();
		
		let question = await survey.questions().first();
		
		if(!question) {
			return instance;
		}
		
		let status = await StatusModel.query().where('slug', 'active').first();
		
		let contacts = await ContactModel.query()
			.where('group_id', group.id)
			.fetch();
		
		contacts = contacts.toJSON();
		
		let sessions = []
		
		let token = await shortToken();
		
		contacts.forEach( (contact) => {
			
			let cont = {
				uuid: token,
				instance_id: instance.id,
				contact_id: contact.id,
				sender_id: instance.sender_id,
				question_id: question.id,
				status_id: status.id,
				created_at: moment(Date.now()).format('YY:MM:DD h:m:s'),
				updated_at: moment(Date.now()).format('YY:MM:DD h:m:s'),
			}
			
			sessions.push(cont);
		});
		
		return await Database.insert(sessions).into('sessions');
	}
}

module.exports = Sessions;