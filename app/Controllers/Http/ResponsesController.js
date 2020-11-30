'use strict';

const ResponseHandler = new(use('App/Modules/Responses/ResponseHandler'))();
const ChannelModel = use('App/Models/Channel');

class ResponsesController {
	
	async handle({ request, response })
	{
		let req = request.all();
		
		let channel = await ChannelModel.query().where ('service', req.type).first();
		
		let result = await ResponseHandler.handle(req.data, channel);
		
		return response.json(result);
	}
}

module.exports = ResponsesController;