'use strict';

const { PubSub } = require('@google-cloud/pubsub');
const client = new PubSub();
const cuid = require('cuid');
const moment = require('moment');

const publish = async (data, topic, event) =>
{
	let payload = {
		id: cuid(),
		event: event,
		data: data,
		timestamp: moment().unix()
	};
	
	const dataBuffer = Buffer.from(JSON.stringify(payload));
	
	try {
		let msg_id = await client.topic(topic).publish(dataBuffer);
		
		return {
			status: 201,
			message: 'Successful'
		}
	} catch (error) {
		return {
			status: 406,
			message: error.message
		}
	}
};

module.exports = {
	publish
};

