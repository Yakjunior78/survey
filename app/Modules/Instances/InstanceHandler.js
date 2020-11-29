'use strict';

const { publish } = use('App/Services/Messaging/PubSubHandler');
const InstanceModel = use('App/Models/Instance');

const { isNowOrPast } = use('App/Helpers/DateHelper');

const Env = use('Env');
const Event = use('Event');

class InstanceHandler {
	
	async ready(id) {
		
		let instance = await InstanceModel.query().where('id', id).first();
		
		instance.should_dispatch = true;
		
		await instance.save ();
		
		if(isNowOrPast(instance.start_at)) {
			Event.fire('instance::ready', instance);
		}
		
		return {
			status: 201,
			message: 'Instance marked as ready',
			instance: instance
		}
	}
}

module.exports = InstanceHandler;