'use strict';

const ChannelModel = use('App/Models/Channel');

const { publish, generateLink, testToken } = use('App/Jobs/Survey');

const Instance = exports = module.exports = {}

Instance.created = async (instance) => {
	
	let channel = await instance.channel().fetch();
	
	if(!channel) {
		return false;
	}
	
	switch(channel.slug) {
		
		case 'sms':
			await publish(instance);
			return await updateInstance(instance);
		case 'web':
			await generateLink(instance);
			return await updateInstance(instance);
		default:
			return 'Channel not supported'
	}
}

async function updateInstance(instance) {
	let channel = await instance.channel().fetch();
	instance.queued = true;
	return instance.save ();
}