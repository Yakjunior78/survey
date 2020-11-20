'use strict';

const { publish } = use('App/Services/Messaging/PubSubHandler');
const InstanceModel = use('App/Model/Instance');

class InstanceHandler {
	
	async dispatch(id) {
		
		let instance = await InstanceModel.find(id);
		
		return await publish(
			instance,
			Env.get('DISPATCH_SURVEY_INSTANCE'),
			'dispatch_survey_instance'
		);
	}
}

module.exports = InstanceHandler;