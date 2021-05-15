'use strict';

const InstanceModel = use('App/Models/Instance');

const { isNowOrPast } = use('App/Helpers/DateHelper');


const Event = use('Event');

class InstanceHandler {

	async ready(id) {

		let instance = await InstanceModel.find(id);

		instance.should_dispatch = true;

		await instance.save ();

		let shouldDispatch = await isNowOrPast(instance.start_at);

		console.log('DISPATCH INSTANCE: .......................................');

		Event.fire('instance::ready', instance);
		// if(shouldDispatch) {
		// 	console.log('DISPATCH INSTANCE: instance already marked as ready');
		// 	Event.fire('instance::ready', instance);
		// }

		return {
			status: 201,
			message: 'Instance marked as ready',
			instance: instance
		}
	}
}

module.exports = InstanceHandler;
