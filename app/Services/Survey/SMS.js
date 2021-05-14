'use strict';

const { publish } = use('App/Services/Messaging/RedisPubSubHandler');
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

		return await publish(instance, 'contact:clone');
	}

	async createSessions(instance)
	{
		instance.session_job_queued = true;

		await instance.save();

		return await publish(instance, 'contact:session');
	}

	async deductResources(instance)
	{
		instance.billing_queued = true;

		await instance.save();

		return await publish(instance, 'resource:deduct');
	}

	async dispatch(instance)
	{
		instance.send_sms_job_queued = true;

		await instance.save();

		return await publish(instance, 'instance:dispatch');
	}
}

module.exports = SMS;
