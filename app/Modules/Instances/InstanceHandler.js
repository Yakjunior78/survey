'use strict';

const InstanceModel = use('App/Models/Instance');

const { isNowOrPast } = use('App/Helpers/DateHelper');


const Event = use('Event');

class InstanceHandler {
	
	async ready(id) {
		
		let instance = await InstanceModel.findById(id);
		
		instance.should_dispatch = true;
		
		await instance.save ();
		
		let shouldDispatch = await isNowOrPast(instance.start_at);
		
		if(shouldDispatch) {
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