'use strict';

const { Command } = require('@adonisjs/ace');
const {PubSub} = require('@google-cloud/pubsub');

const Env = use('Env');
const Logger = use('Logger');
const sub = Env.get('DISPATCH_SURVEY_INSTANCE_SUBSCRIPTION');

const pubSubClient = new PubSub();

const instanceHandler = new(use('App/Jobs/Instance'))();

class DispatchSurveyInstance extends Command {
	
	static get signature () {
		return 'instance:dispatch'
	}
	
	static get description () {
		return 'Dispatch survey instance';
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
			
			await instanceHandler.dispatch(payload.data);
			
			message.ack();
			
			Logger.info('Instance dispatched successfully');
			
		} catch (e) {
			Logger.info(e.message, 'this is the error');
			message.nack();
		}
	}
}

module.exports = DispatchSurveyInstance;
