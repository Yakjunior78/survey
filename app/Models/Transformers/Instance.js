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
			sender: sender,
			should_dispatch: instance.should_dispatch,
			clone_job_queued: instance.clone_job_queued,
			cloned: instance.cloned,
			session_job_queued: instance.session_job_queued,
			sessions_created: instance.sessions_created,
			send_sms_job_queued: instance.send_sms_job_queued,
			sms_sent: instance.sms_sent,
			billing_queued: instance.billing_queued,
			billed: instance.billed,
			created_by: instance.created_by_name,
			created_at: instance.created_at,
			started_at: instance.start_at
		}
	}
}

module.exports = InstanceTransformer;