'use strict';

const { publish } = use('App/Services/Messaging/PubSubHandler');

const Env = use('Env');
const Logger = use('Logger');

const Contacts = exports = module.exports = {};

Contacts.sync = async (instance) => {
	return await publish(
		instance,
		Env.get('CONTACT_SYNC_TOPIC'),
		'contacts_sync'
	);
};
