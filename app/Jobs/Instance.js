const GroupModel = use('App/Models/Group');
const InstanceModel = use('App/Models/Instance');
const SessionModel = use('App/Models/Session');
const ContactModel = use('App/Models/Contact');

const SMS = new(use('App/Services/SMS/Send'))();

const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();

const { smsReply } = use('App/Helpers/Question');
const Env = use('Env');

class Instance {
	
	async dispatch(instance)
	{
		instance = await InstanceModel.query().where('id', instance.id).first();
		
		if(!instance) {
			return;
		}
		
		let group = await GroupModel.query().where('code', instance.group_id).first();
		
		if(!group) {
			return instance;
		}
		
		let data = await this.messageData(group, instance);
		
		console.log(data, 'these are the contacts');

		return instance;
	}
	
	async messageData(group, instance) {

		return ContactModel
			.query ()
			.where('group_id', group.id)
			.fetch();
	}
	
	async message(instance)
	{
		instance = await InstanceModel.query().where('id', instance.id).first();
		
		let survey = await instance.survey().first();
		
		let question = await QuestionRepo.get(survey, 1);
		
		return await smsReply(question);
	}
}

module.exports = Instance;