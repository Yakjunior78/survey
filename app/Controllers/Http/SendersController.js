'use strict';

const repo = new(use('App/Modules/Senders/SenderRepository'))();

class SendersController {
	
	async index({ request, response })
	{
		let requests = request.all();
		
		let senders = await repo.all(requests.account);
		
		return response.json(senders);
	}
}

module.exports = SendersController;