'use strict';

const {PubSub} = require('@google-cloud/pubsub');
const timeout = 60;
const topic = 'test-topic';

const Message = new(use('App/Modules/Messages/Message'))();
const SMS = new(use('App/Modules/Surveys/SMS'))();
const Auth = new(use('App/Modules/Auth/SMS'))();

class TestController {
	
	async publish ({ request, response }) {
		let resp = await Message.publish({req: request.all()});
		return response.json(resp);
	}
	
	async sendSms({ request, response }) {
		
		let data = request.all();
		
		let resp = await SMS.sendSingleSms(data);
		
		return response.json({
			'status': 200,
			'data': resp
		})
	}
	
	async token({ response }) {
		
		let token = await Auth.headers();
		
		return response.json({
			'status' : 200,
			'token' : token
		});
	}
}

module.exports = TestController
