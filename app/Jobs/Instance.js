const GroupModel = use('App/Models/Group');
const InstanceModel = use('App/Models/Instance');
const SMS = new(use('App/Services/SMS/Send'))();

const { smsReply } = use('App/Helpers/Question');

class Instance {
	
	async dispatch(instance)
	{
		let group = await GroupModel.query().where('code', instance.group_id).first();
		
		let data = await this.messageData(group, instance);
		
		return await SMS.handle(data);
	}
	
	async messageData(group, instance) {
		
		let message = await this.message(instance);
		
		return {
			from: Env.get('DEFAULT_SHORT_CODE'),
			messages: [
				{
					recipient: '254704664119',
					message: message
				}
			]
		}
	}
	
	async message(instance)
	{
		instance = await InstanceModel.query().where('id', instance.id).first();

		let question = await instance.questions ().where ('rank', 1).first();
		
		return await smsReply(question);
	}
}

module.exports = Instance;