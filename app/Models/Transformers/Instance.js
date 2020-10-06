class InstanceTransformer {
	
	async transform(instance) {
		
		let channel = await instance.channel().fetch();
		let status = await instance.status().fetch();
		let group = await instance.group().fetch();
		let sender = await instance.sender().fetch();
		
		return {
			id: instance.id,
			uuid: instance.uuid,
			description: instance.description,
			channel_id: instance.channel_id,
			channel: channel,
			status_id: instance.status_id,
			status: status,
			url: instance.url,
			group: group,
			group_id: instance.group_id,
			sender_id: instance.sender_id,
			sender: sender
		}
	}
}

module.exports = InstanceTransformer;