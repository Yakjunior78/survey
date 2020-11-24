'use strict';

const { Command } = require('@adonisjs/ace');
const {PubSub} = require('@google-cloud/pubsub');

const Env = use('Env');
const Logger = use('Logger');
const sub = Env.get('HANDLE_RESPONSE_SUBSCRIPTION');

const pubSubClient = new PubSub();

const responseHandler = new(use('App/Jobs/Response'))();

class HandleResponse extends Command {
	
	static get signature () {
		return 'response:handle'
	}
	
	static get description () {
		return 'Dispatch survey instance';
	}
	
	async handle (args, options) {
		
		Logger.info('Listening to messages');
		
		const subscription = pubSubClient.subscription(sub);
		
		return subscription.on ('message', await this.messageHandler);
	}
	
	async messageHandler(message) {
		
		Logger.info('handling message');
		
		try {
			const payload = JSON.parse(Buffer.from(message.data, 'utf-8').toString());
			
			Logger.info('Sent for processing');
			
			await responseHandler.handle(payload.data);
			
			Logger.info('Response dispatched successfully');
			
			return message.ack();
			
		} catch (e) {
			Logger.info(e.message, 'this is the error');
			return message.nack();
		}
	}
}

module.exports = HandleResponse;
