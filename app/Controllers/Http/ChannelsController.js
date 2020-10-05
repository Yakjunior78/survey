'use strict';

const ChannelModel = use('App/Models/Channel');

class ChannelsController {
	async index({ response })
	{
		let channels = await ChannelModel.all();
		
		return response.json(channels);
	}
}

module.exports = ChannelsController;