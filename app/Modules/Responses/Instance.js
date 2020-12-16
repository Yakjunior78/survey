const InstanceRepo = new(use('App/Modules/Instances/InstanceRepository'))();
const InstanceModel = use('App/Models/Instance');
const GroupModel = use('App/Models/Group');

const { mapIds } = use('App/Helpers/Emalify');

class Instance {
	
	async find(data, contacts, channel)
	{
		let instance = null;
		
		let group_ids = await mapIds(contacts.toJSON(), 'group_id');
		
		console.log(group_ids, 'grou ids');
		
		let groups = await GroupModel.query().whereIn('id', group_ids).fetch();
		
		let ids = await mapIds(groups.toJSON(), 'code');
		
		console.log(ids, 'ids found')
		
		switch(channel.slug) {
			case 'sms':
				return await this.forSms(data, ids);
			case 'web':
		    case 'chat':
				return await this.forWeb(data.instanceId, channel.slug);
			default:
				return instance;
		}
	}
	
	async forSms(data, group_ids)
	{
		console.log('fetching for sms');
		
		let instances = await InstanceModel.all();
		
		return await InstanceModel
			.query()
			.whereHas('sender', (sender) => {
				sender.where('code', data.shortCode);
			})
			.whereHas('status', (status) => {
				status.where('slug', 'active');
			})
			.whereHas('interaction', (interaction) => {
				interaction.where('slug', 'sms')
			})
			.orderBy('updated_at', 'asc')
			.fetch();
	}
	
	async forWeb(id, channel)
	{
		return InstanceRepo.getInstances (id, channel.slug);
	}
}

module.exports = Instance;