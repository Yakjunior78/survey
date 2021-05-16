'use strict';

const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();
// const repo = new(use('App/Modules/Responses/ResponseRepository'))();
const ChannelModel = use('App/Models/Channel');

class ResponsesController {

	async index({ request, response })
	{
		// let result = await repo.responses(request.all());

		return response.json({});
	}

	async handle({ request, response })
	{
		let req = request.all();

		if(!req.type) {

			req.type = 'OnDemandNotification';

			req.data = {
				'phoneNumber':'254704664119',
				'shortCode':'20880',
				'message':'xema 1'
			}
		}

		let channel = await ChannelModel.query().where ('service', req.type).first();

		let result = await ResponseHandler.handle(req.data, channel);

		return response.json(result);
	}
}

module.exports = ResponsesController;
