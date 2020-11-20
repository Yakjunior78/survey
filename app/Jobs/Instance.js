const GroupModel = use('App/Models/Group');
const InstanceModel = use('App/Models/Instance');
const SMS = new(use('App/Services/SMS/Send'))();

const QuestionRepo = new(use('App/Modules/Questions/QuestionRepository'))();

const { smsReply } = use('App/Helpers/Question');
const Env = use('Env');

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
		
		let survey = await instance.survey().first();
		
		let question = await QuestionRepo.get(survey, 1);
		
		return await smsReply(question);
	}
}

module.exports = Instance;