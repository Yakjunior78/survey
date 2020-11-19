'use strict';

const { Command } = require('@adonisjs/ace');
const {PubSub} = require('@google-cloud/pubsub');

const Env = use('Env');
const Logger = use('Logger');
const sub = Env.get('CONTACT_SYNC_TOPIC_SUBSCRIPTION');

const pubSubClient = new PubSub();

const contactHandler = new(use('App/Jobs/Contacts'))();

class ContactsSync extends Command {
	
	static get signature () {
		return 'contacts:sync'
	}
	
	static get description () {
		return 'Sync contacts to survey contacts';
	}
	
	async handle (args, options) {
		
		Logger.info('Listening to messages');
		
		const subscription = pubSubClient.subscription(sub);
		
		await subscription.on('message', await this.messageHandler);
	}
	
	async messageHandler(message) {
		
		Logger.info('handling message');
		
		try {
			const payload = JSON.parse(Buffer.from(message.data, 'utf-8').toString());
			
			Logger.info('Sent for processing');
			
			await contactHandler.sync(payload.data);
			
			message.ack();
			
			Logger.info('Contacts synced successfully');
			
		} catch (e) {
			Logger.info(e.message, 'this is the error');
			message.nack();
		}
	}
}

module.exports = ContactsSync;
