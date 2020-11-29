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
		
		if(instance.sms_sent) {
			console.log('sms for the instance has already been dispatched');
			return;
		}
		
		let group = await GroupModel.query().where('code', instance.group_id).first();
		
		if(!group) {
			return instance;
		}
		
		let data = await this.messageData(group, instance);
		
		await SMS.handle(data);
		
		instance.sms_sent = true;
		
		return instance.save();
	}
	
	async messageData(group, instance)
	{
		let message = await this.message(instance);
		
		let contacts = await ContactModel
			.query()
			.where('group_id',  group.id)
			.fetch();
		
		contacts = contacts.toJSON();
		
		let messages = []

		for (const contact of contacts) {
			let recipient = {
				recipient: contact.msisdn,
				message: message
			}

			messages.push(recipient);
		}
		
		return {
			from: Env.get('DEFAULT_SHORT_CODE'),
			messages: messages
		}
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