const GroupModel = use('App/Models/Group');
const InstanceModel = use('App/Models/Instance');
const SessionModel = use('App/Models/Session');
const ContactModel = use('App/Models/Contact');

const SMS = new(use('App/Services/SMS/Send'))();
const InstanceQuestion = new( use('App/Modules/Questions/InstanceQuestionHandler'))();

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
		let message = await InstanceQuestion.handle(instance);
		
		let channel = await instance.channel().first();
		
		let contacts = await ContactModel
			.query()
			.where('group_id',  group.id)
			.fetch();
		
		contacts = contacts.toJSON();
		
		let mode = await instance.interaction().first();
		
		let messages = []

		for (const contact of contacts) {
			let recipient = {
				recipient: contact.msisdn,
				message: message  + mode.slug === 'web-link' ? '?cid='+contact.uuid+'&channel='+channel.id : ''
			}

			messages.push(recipient);
		}
		
		return {
			from: Env.get('DEFAULT_SHORT_CODE'),
			messages: messages
		}
	}
}

module.exports = Instance;