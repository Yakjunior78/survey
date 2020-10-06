'use strict';

const StatusRepo = new(use('App/Modules/Statuses/StatusRepository'))();

class StatusesController {
	
	async index({ response }) {
		return response.json({
			statuses: await StatusRepo.get()
		});
	}
}

module.exports = StatusesController
