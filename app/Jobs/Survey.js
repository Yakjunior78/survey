'use strict';

const {PubSub} = require('@google-cloud/pubsub');
const timeout = 60;
const topic = 'test-topic';
const subscription = 'test-subscription';
const uuidv4 = require('uuid/v4');
const Env = use('Env');

const publish = async(instance) => {
	
	const pubSubClient = new PubSub();
	
	let data = {
		instance_id: instance.id
	}
	
	const dataBuffer = Buffer.from(JSON.stringify(data));
	let messageId = await pubSubClient.topic(topic).publish(dataBuffer);
	
	return instance;
}

const generateLink = async (instance) => {
	
	let token = uuidv4(6);
	
	instance.token = token;
	instance.url = Env.get('SURVEY_WEB_URI') + '/' + token;
	
	return instance.save();
}

const listen = async () => {
	return true;
}

module.exports = {
	publish,
	generateLink,
	listen
}
