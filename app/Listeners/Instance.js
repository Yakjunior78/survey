'use strict';

const ChannelModel = use('App/Models/Channel');

const { publish, generateLink } = use('App/Jobs/Survey');

const Instance = exports = module.exports = {}

Instance.created = async (instance) => {
	
	let channel = await instance.channel().fetch();
	
	if(!channel) {
		return false;
	}
	
	switch(channel.slug) {
		case 'sms':
			await publish(instance);
			await updateInstance(instance);
			break;
		case 'web':
			await generateLink(instance);
			await updateInstance(instance);
			break;
		default:
			return 'Channel not supported'
	}
}

async function updateInstance(instance) {
	instance.queued = true;
	return instance.save ();
}