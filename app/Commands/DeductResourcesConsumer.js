'use strict';

const Env = use('Env');
const Logger = use('Logger');
const { Command } = require('@adonisjs/ace');
const {PubSub} = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
const sub = Env.get('DEDUCT_RESOURCES_SUBSCRIPTION');

const Billing = new(use('App/Jobs/Billing'))();

class DeductResourcesConsumer extends Command {
	
	static get signature () {
		return 'deduct:resources'
	}
	
	static get description () {
		return 'Clone contact groups to survey contacts';
	}
	
	async handle (args, options) {
		
		Logger.info('Billing handler');
		
		const subscription = pubSubClient.subscription(sub);
		
		return subscription.on ('message', await this.messageHandler);
	}
	
	async messageHandler(message) {
		
		Logger.info('BILLING: resource deduction started');
		
		try {
			const payload = JSON.parse(Buffer.from(message.data, 'utf-8').toString());
			
			await Billing.handle(payload.data);
			
			Logger.info('BILLING:resources deduction completed');
			
			return message.ack();
			
		} catch (e) {
			Logger.info(e.message, 'this is the error');
			return message.nack();
		}
	}
}

module.exports = DeductResourcesConsumer
