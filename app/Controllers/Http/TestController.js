'use strict';

const {PubSub} = require('@google-cloud/pubsub');
const timeout = 60;
const topic = 'test-topic';
const Database = use('Database');
const Redis = use('Redis');

const Message = new(use('App/Modules/Messages/Message'))();
const SMS = new(use('App/Modules/Surveys/SMS'))();
const Auth = new(use('App/Modules/Auth/SMS'))();

const ContactModel = use('App/Models/Contact');
const SessionModel = use('App/Models/Session');
const InstanceModel = use('App/Models/Instance');
const GroupModel = use('App/Models/Group');
const StatusModel = use('App/Models/Status');

const job = new(use('App/Jobs/Instance'))();

const sessionHandler = new(use('App/Jobs/Session'))();
const contactsClone = new(use('App/Modules/Contacts/ContactsClone'))();

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
		let instance =await InstanceModel.find(16);

		await job.dispatch(instance);
	}

	async cloneContacts({ request, response })
	{
		let instance = await InstanceModel.find(181);

		console.log(instance, 'this is the instance')

		if(instance.cloned) {
			console.log('Instance already cloned');
			return;
		}

		return response.json({
			data: await contactsClone.handle(instance)
		});
	}

	async testDocker()
	{
		console.log('We are here');
	}

	async testRedis({ request, response })
	{
		let date = (new Date()).toISOString();

		await Redis.set(date, request.all());

		let contacts = await ContactModel.all();

		return response.json(contacts)
	}
}

module.exports = TestController
