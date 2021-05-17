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
				'phoneNumber': (req.from).substring(1),
				'shortCode': req.to,
				'message': await this.trimMessage(req.text)
			}
		}

		console.log(req, 'This is the request');

		let channel = await ChannelModel.query().where ('service', req.type).first();

		let result = await ResponseHandler.handle(req.data, channel);

		return response.json(result);
	}

	async trimMessage(str) {

		let position = str.search(/Dng/i);

		if (position === 0) {
			str = str.substring( str.indexOf(" ") + 1, str.length );
		}

		return str;
	}
}

module.exports = ResponsesController;
