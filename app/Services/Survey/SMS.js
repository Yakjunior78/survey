const { publish } = use('App/Services/Messaging/PubSubHandler');
const Env = use('Env');

class SMS {
	
	async handle(instance)
	{
		if(!instance.clone_job_queued) {
			return await this.clone(instance);
		}
		
		if(!instance.session_job_queued) {
			return await this.createSessions(instance);
		}
		
		if(!instance.billing_queued) {
			return await this.deductResources(instance);
		}

		if(!instance.send_sms_job_queued) {
			return await this.dispatch(instance);
		}

		return instance;
	}
	
	async clone(instance)
	{
		instance.clone_job_queued = true;
		await instance.save();
		
		return await publish(
			instance,
			Env.get('CLONE_SURVEY_CONTACTS'),
			'clone_survey_contacts'
		);
	}
	
	async createSessions(instance)
	{
		instance.session_job_queued = true;
		await instance.save();
		
		return await publish(
			instance,
			Env.get('CREATE_SURVEY_INSTANCE_SESSIONS'),
			'create_survey_instance_sessions'
		);
	}
	
	async deductResources(instance)
	{
		instance.billing_queued = true;
		await instance.save();
		
		return await publish(
			instance,
			Env.get('DEDUCT_RESOURCES'),
			'deduct_resources'
		);
	}
	
	async dispatch(instance)
	{
		instance.send_sms_job_queued = true;
		await instance.save();
		
		return await publish(
			instance,
			Env.get('SEND_SURVEY_INSTANCE_SMS'),
			'send_survey_instance_sms'
		);
	}
}

module.exports = SMS;