'use strict';

const {PubSub} = require('@google-cloud/pubsub');
const timeout = 60;
const topic = 'test-topic';

class SurveyResponse {
	
	async handle(req) {
		const dataBuffer = Buffer.from(JSON.stringify(req));
		await (new PubSub()).topic(topic).publish(dataBuffer);
	}
	
	async listen() {
	
	}
}

module.exports = SurveyResponse;