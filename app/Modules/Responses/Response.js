const InstanceRepo = new(use('App/Modules/Instances/InstanceRepository'))();

const InstanceModel = use('App/Models/Instance');
const ResponseModel = use('App/Models/Response');

class Response {
	
	async record(session, data, channel)
	{
		let sessionTrail = await session
			.sessionTrails()
			.whereNull('replied')
			.orderBy('created_at', 'desc')
			.first();
		
		let question = await sessionTrail.question().first();
		
		if(!question) return null;
		
		let response = data.message;
		
		switch(channel.slug) {
			case 'sms':
				let choice = await question.choices().where('rank', data.message).first();
				response = choice && choice.id ? choice.value : data.message;
				break;
			case 'web':
			case 'chat':
				response = data.message
				break;
			default:
				response = data.message;
				break;
		}
		
		return await ResponseModel.create({
			response: response,
			question_id: question.id,
			contact_id: session.contact_id,
			session_id: session.id,
			channel_id: channel.id
		});
	}
}

module.exports = Response;