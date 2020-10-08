const InstanceRepo = new(use('App/Modules/Instances/InstanceRepository'))();
const InstanceModel = use('App/Models/Instance');

class Instance {
	
	async find(data, type)
	{
		let instance = null;
		
		switch(type) {
			case 'sms':
				return await this.forSms(data);
			case 'web':
		    case 'chat':
				return await this.forWeb(data.instanceId, type);
			default:
				return instance;
		}
	}
	
	async forSms(data)
	{
		return await InstanceModel
			.query()
			.whereHas('sender', (sender) => {
				sender.where('code', data.shortCode);
			})
			.whereHas('status', (status) => {
				status.where('slug', 'active');
			})
			.orderBy('updated_at', 'asc')
			.fetch();
	}
	
	async forWeb(id, type)
	{
		return InstanceRepo.getInstance (id, type);
	}
}

module.exports = Instance;