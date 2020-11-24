'use strict';

const { publish } = use('App/Services/Messaging/PubSubHandler');
const InstanceModel = use('App/Models/Instance');

const { isNowOrPast } = use('App/Helpers/DateHelper');

const Env = use('Env');

class InstanceHandler {
	
	async handle(id) {
		
		let instance = await InstanceModel.query().where('id', id).first();
		
		let sendNow = await isNowOrPast(instance.start_at);
		
		if(sendNow) {
			instance.should_dispatch = true;
			await instance.save();
			
			return instance;
		}
		
		if(!instance || !instance.should_dispatch) {
			return {
				message: 'Unable to dispatch instance'
			}
		}
		
		if((!instance.clone_job_queued || instance.clone_job_queued) && !instance.cloned) {
			return await this.clone(instance);
		}
		
		if((!instance.session_job_queued || instance.session_job_queued) && !instance.session_created) {
			return await this.createSessions(instance);
		}
		
		if((!instance.send_sms_job_queued || instance.session_job_queued) && !instance.sms_sent) {
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

module.exports = InstanceHandler;