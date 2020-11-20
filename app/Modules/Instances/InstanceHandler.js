'use strict';

const { publish } = use('App/Services/Messaging/PubSubHandler');
const InstanceModel = use('App/Models/Instance');

const Env = use('Env');

class InstanceHandler {
	
	async dispatch(id) {
		
		let instance = await InstanceModel.query().where('id', id).first();
		
		return await publish(
			instance,
			Env.get('DISPATCH_SURVEY_INSTANCE'),
			'dispatch_survey_instance'
		);
	}
}

module.exports = InstanceHandler;