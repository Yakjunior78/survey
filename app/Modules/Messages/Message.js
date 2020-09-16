'use strict';

let MessageModel = use('App/Models/Message');

const {PubSub} = require('@google-cloud/pubsub');
const timeout = 60;
const topic = 'test-topic';
const subscription = 'test-subscription';

class Message {
	
	 async publish ({req}) {
	 
		const pubSubClient = new PubSub();
		const dataBuffer = Buffer.from(JSON.stringify(req));
		let messageId = await pubSubClient.topic(topic).publish(dataBuffer);
		
		return {
			id: messageId,
			status: 200
		}
	}
}

module.exports = Message;