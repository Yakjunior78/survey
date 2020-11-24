'use strict';

const ChannelModel = use('App/Models/Channel');
const { generateLink } = use('App/Jobs/Survey');

const Instance = exports = module.exports = {}

Instance.created = async (instance) => {
	
	let channel = await instance.channel().fetch();
	
	if(!channel) {
		return false;
	}
	
	await generateLink(instance);
	
	return await updateInstance(instance);
}

async function updateInstance(instance) {
	let channel = await instance.channel().fetch();
	instance.queued = true;
	return instance.save ();
}