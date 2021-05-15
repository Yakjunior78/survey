const GroupModel = use('App/Models/Group');
const InstanceModel = use('App/Models/Instance');
const SessionModel = use('App/Models/Session');
const ContactModel = use('App/Models/Contact');
const ProfileContactGroupModel = use('App/Models/ProfileContactGroup');

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

		console.log('1:Found instance');

		let group = await GroupModel.query().where('code', instance.group_id).first();

		if(!group) {
			console.log('group was not found');
			return instance;
		}

		console.log('2:Found group');

		let data = await this.messageData(group, instance);

		console.log(data, 'this is the data');

		console.log('dispatching the sms');

		await SMS.handle(data);

		instance.sms_sent = true;

		return instance.save();
	}

	async messageData(group, instance)
	{
		let message = await InstanceQuestion.handle(instance);

		let profileContactGroup = await ProfileContactGroupModel
			.query()
			.where('contactGroupID', group.code)
			.first()

		return {
			'message': message,
			'profileContactGroupMappingId': profileContactGroup.profileContactGroupMappingID
		}
	}
}

module.exports = Instance;
