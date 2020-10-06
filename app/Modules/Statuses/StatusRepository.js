'use strict';

const StatusModel = use('App/Models/Status');

class StatusRepository {
	async get() {
		return await StatusModel.all();
	}
}

module.exports = StatusRepository;