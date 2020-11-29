'use strict';

const ChannelModel = use('App/Models/Channel');
const InteractionModel = use('App/Models/Interaction');

class ChannelsController {
	
	async index({ response })
	{
		let channels = await ChannelModel.all();
		return response.json(channels);
	}
	
	async interactionModes({ response })
	{
		let modes = await InteractionModel.all();
		return response.json(modes);
	}
}

module.exports = ChannelsController;