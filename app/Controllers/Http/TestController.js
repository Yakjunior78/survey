'use strict';

const {PubSub} = require('@google-cloud/pubsub');
const timeout = 60;
const topic = 'test-topic';
const Database = use('Database');

const Message = new(use('App/Modules/Messages/Message'))();
const SMS = new(use('App/Modules/Surveys/SMS'))();
const Auth = new(use('App/Modules/Auth/SMS'))();

const ContactModel = use('App/Models/Contact');
const SessionModel = use('App/Models/Session');
const InstanceModel = use('App/Models/Instance');
const GroupModel = use('App/Models/Group');
const StatusModel = use('App/Models/Status');
const { shortToken } = use('App/Helpers/Emalify');

const sessionHandler = new(use('App/Jobs/Session'))();
const moment = use('moment');

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
	
	async createSession({ params, response })
	{
		let id = params.id;
		
		let instance = await InstanceModel.query().where('id', id).first();
		
		if(!instance) {
			return;
		}
		
		let group = await GroupModel.query().where('id', instance.group_id).first();
		
		if(!group) {
			return instance;
		}
		
		let survey = await instance.survey().first();
		
		let question = await survey.questions().first();
		
		if(!question) {
			return instance;
		}
		
		let status = await StatusModel.query().where('slug', 'active').first();
		
		let contacts = await ContactModel.query()
			.where('group_id', group.id)
			.fetch();
		
		contacts = contacts.toJSON();
		
		let sessions = []
		
		
		for (const contact of contacts) {
			
			let token = await shortToken();
			
			let cont = {
				uuid: token,
				instance_id: instance.id,
				contact_id: contact.id,
				sender_id: instance.sender_id,
				question_id: question.id,
				status_id: status.id,
				created_at: moment(Date.now()).format('YY:MM:DD h:m:s'),
				updated_at: moment(Date.now()).format('YY:MM:DD h:m:s'),
			}
			
			sessions.push(cont);
		}
		
		return await Database.insert(sessions).into('sessions');
	}
}

module.exports = TestController
