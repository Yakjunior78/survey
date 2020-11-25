'use strict';

const Env = use('Env');
const Logger = use('Logger');

const { Command } = require('@adonisjs/ace');
const {PubSub} = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();
const sub = Env.get('CLONE_SURVEY_CONTACTS_SUBSCRIPTION');

const contactHandler = new(use('App/Jobs/Contacts'))();

class CloneContacts extends Command {
	
	static get signature () {
		return 'contacts:clone'
	}
	
	static get description () {
		return 'Clone contact groups to survey contacts';
	}
	
	async handle (args, options) {
		
		Logger.info('Contacts clone handler');
		
		const subscription = pubSubClient.subscription(sub);
		
		subscription.on ('message', await this.messageHandler);
	}
	
	async messageHandler(message) {
		
		Logger.info('Contacts cloning started');
		
		try {
			const payload = JSON.parse(Buffer.from(message.data, 'utf-8').toString());
			
			await contactHandler.clone(payload.data);
			
			Logger.info('Contacts cloned completed');
			
			return message.ack();
			
		} catch (e) {
			Logger.info(e.message, 'this is the error');
			return message.nack();
		}
	}
}

module.exports = CloneContacts;
